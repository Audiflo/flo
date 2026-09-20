#[cfg(test)]
mod psychoacoustic_tests {
    use libflo_audio::lossy::psychoacoustic::*;

    #[test]
    fn test_ath_curve() {
        let ath_1k = PsychoacousticModel::absolute_threshold_of_hearing(1000.0);
        let ath_100 = PsychoacousticModel::absolute_threshold_of_hearing(100.0);
        let ath_15k = PsychoacousticModel::absolute_threshold_of_hearing(15000.0);

        assert!(
            ath_1k < ath_100,
            "Should be more sensitive at 1kHz than 100Hz"
        );
        assert!(
            ath_1k < ath_15k,
            "Should be more sensitive at 1kHz than 15kHz"
        );
    }

    #[test]
    fn test_freq_to_bark() {
        let b_500 = PsychoacousticModel::freq_to_bark(500.0);
        let b_1000 = PsychoacousticModel::freq_to_bark(1000.0);
        let b_4000 = PsychoacousticModel::freq_to_bark(4000.0);

        assert!(b_500 < b_1000);
        assert!(b_1000 < b_4000);

        assert!((b_500 - 5.0).abs() < 1.0);
        assert!((b_1000 - 8.5).abs() < 1.0);
    }

    #[test]
    fn test_bark_bands() {
        let model = PsychoacousticModel::new(44100, 2048);

        assert_eq!(model.get_bark_band(0), 0);
        assert!(model.get_bark_band(model.num_coefficients() - 1) >= 20);
    }

    #[test]
    fn test_masking_threshold() {
        let mut model = PsychoacousticModel::new(44100, 2048);

        let mut coeffs = vec![0.0f32; 1024];
        let tone_bin = (1000.0 / model.frequency_resolution()).round() as usize;
        coeffs[tone_bin] = 1.0;

        let thresholds = model.calculate_masking_threshold(&coeffs);

        let near_tone = thresholds[tone_bin + 1];
        let far_from_tone = thresholds[tone_bin + 100];

        assert!(
            near_tone > far_from_tone,
            "Masking threshold should be higher near the masker"
        );
    }

    #[test]
    fn test_allocate_bits_prioritizes_high_smr_band() {
        let mut model = PsychoacousticModel::new(44100, 2048);

        let mut coeffs = vec![0.0f32; model.num_coefficients()];
        let strong = (1000.0 / model.frequency_resolution()).round() as usize;
        coeffs[strong] = 1.0;

        let smr = model.calculate_smr(&coeffs);
        let allocation = model.allocate_bits(&smr, 1000);

        assert!(
            allocation.iter().any(|&b| b == 0),
            "masked bands should get no bits"
        );
        assert!(
            allocation[strong] > 0,
            "the audible tone band should get bits (got {})",
            allocation[strong]
        );

        // Bits follow SMR, not position
        let far = model.num_coefficients() - 1;
        assert!(allocation[far] <= allocation[strong]);
    }

    #[test]
    fn test_temporal_masking_decays_across_frames() {
        let mut model = PsychoacousticModel::new(44100, 2048);

        let band = 16; // 3150-3700 Hz
        let mut coeffs = vec![0.0f32; model.num_coefficients()];
        let mut tone = 0;
        for (k, c) in coeffs.iter_mut().enumerate() {
            if model.get_bark_band(k) == band {
                *c = 3.0;
                if tone == 0 {
                    tone = k;
                }
            }
        }
        assert!(tone > 0, "band 16 should hold coefficients");

        // Loud frame raises the band threshold via temporal (post-)masking.
        model.calculate_masking_threshold(&coeffs);

        // Silence after the loud frame: threshold decays ~3 dB/frame to the ATH floor.
        let silence = vec![0.0f32; model.num_coefficients()];
        let t1 = model.calculate_masking_threshold(&silence);
        let t2 = model.calculate_masking_threshold(&silence);
        let t3 = model.calculate_masking_threshold(&silence);

        let mut baseline = PsychoacousticModel::new(44100, 2048);
        let floor = baseline.calculate_masking_threshold(&silence)[tone];

        assert!(
            t1[tone] > floor + 0.1,
            "temporal masking should lift above ATH (t1={:.1}, floor={:.1})",
            t1[tone],
            floor
        );
        assert!(t1[tone] > t2[tone], "mask should decay per frame");
        assert!(
            t3[tone] > floor - 0.1 && t3[tone] < floor + 0.1,
            "mask should converge to the ATH floor (t3={:.1})",
            t3[tone]
        );
    }
}
