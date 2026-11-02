/* @ts-self-types="./libflo_audio.d.ts" */

/**
 * info about a flo file
 */
export class AudioInfo {
    static __wrap(ptr) {
        const obj = Object.create(AudioInfo.prototype);
        obj.__wbg_ptr = ptr;
        AudioInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AudioInfoFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_audioinfo_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.audioinfo_version(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Bits per sample
     * @returns {number}
     */
    get bit_depth() {
        const ret = wasm.__wbg_get_audioinfo_bit_depth(this.__wbg_ptr);
        return ret;
    }
    /**
     * Number of channels
     * @returns {number}
     */
    get channels() {
        const ret = wasm.__wbg_get_audioinfo_channels(this.__wbg_ptr);
        return ret;
    }
    /**
     * Compression ratio (original / compressed)
     * @returns {number}
     */
    get compression_ratio() {
        const ret = wasm.__wbg_get_audioinfo_compression_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * Is CRC valid?
     * @returns {boolean}
     */
    get crc_valid() {
        const ret = wasm.__wbg_get_audioinfo_crc_valid(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Duration in seconds
     * @returns {number}
     */
    get duration_secs() {
        const ret = wasm.__wbg_get_audioinfo_duration_secs(this.__wbg_ptr);
        return ret;
    }
    /**
     * File size in bytes
     * @returns {number}
     */
    get file_size() {
        const ret = wasm.__wbg_get_audioinfo_file_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Is lossy compression mode?
     * @returns {boolean}
     */
    get is_lossy() {
        const ret = wasm.__wbg_get_audioinfo_is_lossy(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Lossy quality 0-4 (only valid if is_lossy)
     * @returns {number}
     */
    get lossy_quality() {
        const ret = wasm.__wbg_get_audioinfo_lossy_quality(this.__wbg_ptr);
        return ret;
    }
    /**
     * Sample rate in Hz
     * @returns {number}
     */
    get sample_rate() {
        const ret = wasm.__wbg_get_audioinfo_sample_rate(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Total sample-frames (samples per channel). This is the number of sample
     * instants per channel (not interleaved samples). Use metadata.length_ms
     * for a quick duration lookup.
     * @returns {bigint}
     */
    get total_samples() {
        const ret = wasm.__wbg_get_audioinfo_total_samples(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Bits per sample
     * @param {number} arg0
     */
    set bit_depth(arg0) {
        wasm.__wbg_set_audioinfo_bit_depth(this.__wbg_ptr, arg0);
    }
    /**
     * Number of channels
     * @param {number} arg0
     */
    set channels(arg0) {
        wasm.__wbg_set_audioinfo_channels(this.__wbg_ptr, arg0);
    }
    /**
     * Compression ratio (original / compressed)
     * @param {number} arg0
     */
    set compression_ratio(arg0) {
        wasm.__wbg_set_audioinfo_compression_ratio(this.__wbg_ptr, arg0);
    }
    /**
     * Is CRC valid?
     * @param {boolean} arg0
     */
    set crc_valid(arg0) {
        wasm.__wbg_set_audioinfo_crc_valid(this.__wbg_ptr, arg0);
    }
    /**
     * Duration in seconds
     * @param {number} arg0
     */
    set duration_secs(arg0) {
        wasm.__wbg_set_audioinfo_duration_secs(this.__wbg_ptr, arg0);
    }
    /**
     * File size in bytes
     * @param {number} arg0
     */
    set file_size(arg0) {
        wasm.__wbg_set_audioinfo_file_size(this.__wbg_ptr, arg0);
    }
    /**
     * Is lossy compression mode?
     * @param {boolean} arg0
     */
    set is_lossy(arg0) {
        wasm.__wbg_set_audioinfo_is_lossy(this.__wbg_ptr, arg0);
    }
    /**
     * Lossy quality 0-4 (only valid if is_lossy)
     * @param {number} arg0
     */
    set lossy_quality(arg0) {
        wasm.__wbg_set_audioinfo_lossy_quality(this.__wbg_ptr, arg0);
    }
    /**
     * Sample rate in Hz
     * @param {number} arg0
     */
    set sample_rate(arg0) {
        wasm.__wbg_set_audioinfo_sample_rate(this.__wbg_ptr, arg0);
    }
    /**
     * Total sample-frames (samples per channel). This is the number of sample
     * instants per channel (not interleaved samples). Use metadata.length_ms
     * for a quick duration lookup.
     * @param {bigint} arg0
     */
    set total_samples(arg0) {
        wasm.__wbg_set_audioinfo_total_samples(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) AudioInfo.prototype[Symbol.dispose] = AudioInfo.prototype.free;

export class WasmStreamingDecoder {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmStreamingDecoderFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmstreamingdecoder_free(ptr, 0);
    }
    /**
     * how many frames ready to decode
     * @returns {number}
     */
    available_frames() {
        const ret = wasm.wasmstreamingdecoder_available_frames(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * bytes currently buffered
     * @returns {number}
     */
    buffered_bytes() {
        const ret = wasm.wasmstreamingdecoder_buffered_bytes(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * current frame index
     * @returns {number}
     */
    current_frame_index() {
        const ret = wasm.wasmstreamingdecoder_current_frame_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * decode all currently available samples
     * @returns {Float32Array}
     */
    decode_available() {
        const ret = wasm.wasmstreamingdecoder_decode_available(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * feed data to the decoder, call as bytes come in from network
     * @param {Uint8Array | number[]} data
     * @returns {boolean}
     */
    feed(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmstreamingdecoder_feed(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] !== 0;
    }
    /**
     * Get audio information (available after header is parsed)
     *
     * Returns null if header hasn't been parsed yet.
     * @returns {any}
     */
    get_info() {
        const ret = wasm.wasmstreamingdecoder_get_info(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Check if there was an error
     * @returns {boolean}
     */
    has_error() {
        const ret = wasm.wasmstreamingdecoder_has_error(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * stream done?
     * @returns {boolean}
     */
    is_finished() {
        const ret = wasm.wasmstreamingdecoder_is_finished(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Check if the decoder is ready to produce audio
     * @returns {boolean}
     */
    is_ready() {
        const ret = wasm.wasmstreamingdecoder_is_ready(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * new streaming decoder
     */
    constructor() {
        const ret = wasm.wasmstreamingdecoder_new();
        this.__wbg_ptr = ret;
        WasmStreamingDecoderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Decode the next available frame
     *
     * Returns interleaved f32 samples for one frame, or null if no frame is ready.
     * This enables true streaming: decode and play frames as they arrive.
     *
     * Usage pattern:
     * ```js
     * while (true) {
     *     const samples = decoder.next_frame();
     *     if (samples === null) break; // No more frames ready
     *     playAudio(samples);
     * }
     * ```
     * @returns {any}
     */
    next_frame() {
        const ret = wasm.wasmstreamingdecoder_next_frame(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Reset the decoder to initial state
     *
     * Use this to start decoding a new stream.
     */
    reset() {
        wasm.wasmstreamingdecoder_reset(this.__wbg_ptr);
    }
    /**
     * Get the current state as a string
     * @returns {string}
     */
    state() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmstreamingdecoder_state(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) WasmStreamingDecoder.prototype[Symbol.dispose] = WasmStreamingDecoder.prototype.free;

/**
 * Encodes samples frame-by-frame as they arrive, returning encoded frames ready for transmission.
 * Use this for low-latency streaming encoding where you push samples and pull frames.
 */
export class WasmStreamingEncoder {
    static __wrap(ptr) {
        const obj = Object.create(WasmStreamingEncoder.prototype);
        obj.__wbg_ptr = ptr;
        WasmStreamingEncoderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmStreamingEncoderFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmstreamingencoder_free(ptr, 0);
    }
    /**
     * Build a complete flo file from all accumulated frames
     *
     * Call flush() first, then this method to generate the complete file.
     * The file will contain all encoded frames with proper table-of-contents.
     *
     * # Arguments
     * * `metadata` - Optional metadata bytes (MessagePack encoded, use create_metadata())
     *
     * # Returns
     * Complete flo file as byte array
     * @param {Uint8Array | number[] | null} [metadata]
     * @returns {Uint8Array}
     */
    finalize(metadata) {
        var ptr0 = isLikeNone(metadata) ? 0 : passArray8ToWasm0(metadata, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmstreamingencoder_finalize(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v2;
    }
    /**
     * Flush remaining samples and finalize encoding
     *
     * Call this when done pushing samples. Encodes any remaining partial frame.
     * After this, call finalize() to get the complete flo file.
     *
     * # Returns
     * Error if encoding fails
     */
    flush() {
        const ret = wasm.wasmstreamingencoder_flush(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Create a new streaming encoder
     *
     * # Arguments
     * * `sample_rate` - Sample rate in Hz (e.g., 44100)
     * * `channels` - Number of channels (1 or 2)
     * * `bit_depth` - Bits per sample (16, 24, or 32)
     *
     * # Returns
     * New encoder instance
     * @param {number} sample_rate
     * @param {number} channels
     * @param {number} bit_depth
     */
    constructor(sample_rate, channels, bit_depth) {
        const ret = wasm.wasmstreamingencoder_new(sample_rate, channels, bit_depth);
        this.__wbg_ptr = ret;
        WasmStreamingEncoderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get the next encoded frame if available
     *
     * Returns an object with: index, timestamp_ms, data (Uint8Array), samples
     * Returns null if no frames are ready yet.
     *
     * # Returns
     * Encoded frame object or null
     * @returns {any}
     */
    next_frame() {
        const ret = wasm.wasmstreamingencoder_next_frame(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get number of encoded frames ready for transmission
     *
     * # Returns
     * Number of ready frames
     * @returns {number}
     */
    pending_frames() {
        const ret = wasm.wasmstreamingencoder_pending_frames(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get number of samples currently buffered
     *
     * # Returns
     * Number of sample frames in buffer
     * @returns {number}
     */
    pending_samples() {
        const ret = wasm.wasmstreamingencoder_pending_samples(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Push audio samples to the encoder
     *
     * Samples should be interleaved if multi-channel (e.g., [L0, R0, L1, R1, ...] for stereo).
     * Frames are encoded automatically when enough samples accumulate.
     *
     * # Arguments
     * * `samples` - Interleaved f32 audio samples (-1.0 to 1.0)
     *
     * # Returns
     * Error if encoding fails
     * @param {Float32Array | number[]} samples
     */
    push_samples(samples) {
        const ptr0 = passArrayF32ToWasm0(samples, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmstreamingencoder_push_samples(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Set compression level (0-9)
     *
     * # Arguments
     * * `level` - Compression level (0=fast/large, 9=slow/small)
     *
     * # Returns
     * Self for method chaining
     * @param {number} level
     * @returns {WasmStreamingEncoder}
     */
    with_compression(level) {
        const val1 = +level;
        const ptr = this.__destroy_into_raw();
        const ret = wasm.wasmstreamingencoder_with_compression(ptr, val1);
        return WasmStreamingEncoder.__wrap(ret);
    }
}
if (Symbol.dispose) WasmStreamingEncoder.prototype[Symbol.dispose] = WasmStreamingEncoder.prototype.free;

/**
 * Compute EBU R128 loudness metrics from audio samples
 *
 * # Arguments
 * * `samples` - Audio samples (interleaved if multi-channel)
 * * `channels` - Number of audio channels
 * * `sample_rate` - Sample rate in Hz
 *
 * # Returns
 * LoudnessMetrics object with integrated LUFS, loudness range LU, and true peak dBTP
 * @param {Float32Array | number[]} samples
 * @param {number} channels
 * @param {number} sample_rate
 * @returns {any}
 */
export function compute_loudness_metrics(samples, channels, sample_rate) {
    const val2 = +channels;
    const val3 = +sample_rate;
    const ptr0 = passArrayF32ToWasm0(samples, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.compute_loudness_metrics(ptr0, len0, val2, val3);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Create metadata from basic fields and serialize to MessagePack
 *
 * # Arguments
 * * `title` - Optional title
 * * `artist` - Optional artist
 * * `album` - Optional album
 *
 * # Returns
 * MessagePack bytes containing metadata
 * @param {string | null} [title]
 * @param {string | null} [artist]
 * @param {string | null} [album]
 * @returns {Uint8Array}
 */
export function create_metadata(title, artist, album) {
    let ptr0, len0, ptr1, len1, ptr2, len2;
    try {
        ptr0 = isLikeNone(title) ? 0 : passStringToWasm0(title, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = isLikeNone(artist) ? 0 : passStringToWasm0(artist, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        len1 = WASM_VECTOR_LEN;
        ptr2 = isLikeNone(album) ? 0 : passStringToWasm0(album, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        len2 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr2) { wasm.__wbindgen_free(ptr2, len2 * 1, 1); }
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
        throw e;
    }
    const ret = wasm.create_metadata(ptr0, len0, ptr1, len1, ptr2, len2);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v4 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v4;
}

/**
 * Create metadata from a JavaScript object
 *
 * Accepts an object with any of the supported metadata fields.
 * See FloMetadata for available fields.
 *
 * # Returns
 * MessagePack bytes containing metadata
 * @param {any} obj
 * @returns {Uint8Array}
 */
export function create_metadata_from_object(obj) {
    const ret = wasm.create_metadata_from_object(obj);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v1;
}

/**
 * decode flo file to samples
 *
 * This automatically detects whether the file uses lossless or lossy encoding
 * and dispatches to the appropriate decoder.
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * Interleaved audio samples (f32, -1.0 to 1.0)
 * @param {Uint8Array | number[]} data
 * @returns {Float32Array}
 */
export function decode(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.decode(ptr0, len0);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * Decode a single frame by index without decoding the entire file
 *
 * # Arguments
 * * `flo_data` - Complete flo file bytes
 * * `frame_index` - Zero-based frame index
 *
 * # Returns
 * Interleaved audio samples for that frame (f32, -1.0 to 1.0)
 * @param {Uint8Array | number[]} flo_data
 * @param {number} frame_index
 * @returns {Float32Array}
 */
export function decode_frame_at(flo_data, frame_index) {
    const val2 = +frame_index;
    const ptr0 = passArray8ToWasm0(flo_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.decode_frame_at(ptr0, len0, val2);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayF32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v3;
}

/**
 * encode samples to flo lossless
 *
 * # Arguments
 * * `samples` - Interleaved audio samples (f32, -1.0 to 1.0)
 * * `sample_rate` - Sample rate in Hz (e.g., 44100)
 * * `channels` - Number of channels (1 or 2)
 * * `bit_depth` - Bits per sample (16, 24, or 32)
 * * `metadata` - Optional MessagePack metadata
 *
 * # Returns
 * flo file as byte array
 *
 * # Note
 * For advanced usage with custom compression levels (0-9),
 * use the `Encoder` builder pattern directly.
 * @param {Float32Array | number[]} samples
 * @param {number} sample_rate
 * @param {number} channels
 * @param {number} bit_depth
 * @param {Uint8Array | number[] | null} [metadata]
 * @returns {Uint8Array}
 */
export function encode(samples, sample_rate, channels, bit_depth, metadata) {
    const val3 = +sample_rate;
    const val4 = +channels;
    const val5 = +bit_depth;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArrayF32ToWasm0(samples, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = isLikeNone(metadata) ? 0 : passArray8ToWasm0(metadata, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 4, 4); }
        throw e;
    }
    const ret = wasm.encode(ptr0, len0, val3, val4, val5, ptr1, len1);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v6 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v6;
}

/**
 * encode samples to flo lossy
 *
 * # Arguments
 * * `samples` - Interleaved audio samples (f32, -1.0 to 1.0)
 * * `sample_rate` - Sample rate in Hz (e.g., 44100)
 * * `channels` - Number of audio channels (1 or 2)
 * * `bit_depth` - Bits per sample (typically 16)
 * * `quality` - Quality level 0-4 (0=low/~64kbps, 4=transparent/~320kbps)
 * * `metadata` - Optional MessagePack metadata
 *
 * # Returns
 * flo file as byte array
 *
 * # Note
 * For advanced usage with continuous quality control (0.0-1.0) or custom settings,
 * use the `LossyEncoder` builder pattern directly.
 * @param {Float32Array | number[]} samples
 * @param {number} sample_rate
 * @param {number} channels
 * @param {number} _bit_depth
 * @param {number} quality
 * @param {Uint8Array | number[] | null} [metadata]
 * @returns {Uint8Array}
 */
export function encode_lossy(samples, sample_rate, channels, _bit_depth, quality, metadata) {
    const val3 = +sample_rate;
    const val4 = +channels;
    const val5 = +_bit_depth;
    const val6 = +quality;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArrayF32ToWasm0(samples, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = isLikeNone(metadata) ? 0 : passArray8ToWasm0(metadata, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 4, 4); }
        throw e;
    }
    const ret = wasm.encode_lossy(ptr0, len0, val3, val4, val5, val6, ptr1, len1);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v7 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v7;
}

/**
 * encode to flo lossy with target bitrate
 *
 * # Arguments
 * * `samples` - Interleaved audio samples (f32, -1.0 to 1.0)
 * * `sample_rate` - Sample rate in Hz (e.g., 44100)
 * * `channels` - Number of audio channels
 * * `bit_depth` - Bits per sample (16, 24, or 32)
 * * `target_bitrate_kbps` - Target bitrate in kbps (e.g., 128, 192, 256, 320)
 * * `metadata` - Optional MessagePack metadata
 *
 * # Returns
 * flo file as byte array
 * @param {Float32Array | number[]} samples
 * @param {number} sample_rate
 * @param {number} channels
 * @param {number} _bit_depth
 * @param {number} target_bitrate_kbps
 * @param {Uint8Array | number[] | null} [metadata]
 * @returns {Uint8Array}
 */
export function encode_with_bitrate(samples, sample_rate, channels, _bit_depth, target_bitrate_kbps, metadata) {
    const val3 = +sample_rate;
    const val4 = +channels;
    const val5 = +_bit_depth;
    const val6 = +target_bitrate_kbps;
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArrayF32ToWasm0(samples, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = isLikeNone(metadata) ? 0 : passArray8ToWasm0(metadata, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 4, 4); }
        throw e;
    }
    const ret = wasm.encode_with_bitrate(ptr0, len0, val3, val4, val5, val6, ptr1, len1);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v7 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v7;
}

/**
 * Extract dominant frequencies from spectral fingerprint
 *
 * # Arguments
 * * `fingerprint_js` - SpectralFingerprint JavaScript object
 * * `num_frequencies` - Number of dominant frequencies to extract per frame
 *
 * # Returns
 * JavaScript array of arrays containing dominant frequencies (Hz) for each frame
 * @param {any} fingerprint_js
 * @param {number} num_frequencies
 * @returns {any}
 */
export function extract_dominant_frequencies_from_fingerprint_wasm(fingerprint_js, num_frequencies) {
    const ret = wasm.extract_dominant_frequencies_from_fingerprint_wasm(fingerprint_js, num_frequencies);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extract dominant frequencies from audio samples (convenience function)
 *
 * # Arguments
 * * `samples` - Audio samples (interleaved if multi-channel)
 * * `sample_rate` - Sample rate in Hz
 * * `channels` - Number of audio channels
 * * `num_frequencies` - Number of dominant frequencies to extract per frame
 * * `fft_size` - FFT window size (optional, will auto-select if None)
 * * `hop_size` - Hop size between frames (optional, will auto-select if None)
 *
 * # Returns
 * JavaScript array of arrays containing dominant frequencies (Hz) for each frame
 * @param {Float32Array | number[]} samples
 * @param {number} sample_rate
 * @param {number} channels
 * @param {number} num_frequencies
 * @param {number | null} [fft_size]
 * @param {number | null} [hop_size]
 * @returns {any}
 */
export function extract_dominant_frequencies_from_samples_wasm(samples, sample_rate, channels, num_frequencies, fft_size, hop_size) {
    const val2 = +sample_rate;
    const val3 = +channels;
    const val4 = +num_frequencies;
    const val5 = +(isLikeNone(fft_size) ? Number.MAX_SAFE_INTEGER : (fft_size) >>> 0);
    const val6 = +(isLikeNone(hop_size) ? Number.MAX_SAFE_INTEGER : (hop_size) >>> 0);
    const ptr0 = passArrayF32ToWasm0(samples, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.extract_dominant_frequencies_from_samples_wasm(ptr0, len0, val2, val3, val4, val5, val6);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extract dominant frequencies from spectral fingerprint
 * @param {any} fingerprint_js
 * @param {number} num_frequencies
 * @returns {any}
 */
export function extract_dominant_frequencies_wasm(fingerprint_js, num_frequencies) {
    const ret = wasm.extract_dominant_frequencies_wasm(fingerprint_js, num_frequencies);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extract spectral fingerprint from audio samples
 *
 * # Arguments
 * * `samples` - Audio samples (interleaved if multi-channel)
 * * `channels` - Number of audio channels
 * * `sample_rate` - Sample rate in Hz
 * * `fft_size` - FFT window size (must be power of 2)
 * * `hop_size` - Hop size between consecutive frames
 *
 * # Returns
 * SpectralFingerprint object with frequency analysis
 * @param {Float32Array | number[]} samples
 * @param {number} channels
 * @param {number} sample_rate
 * @param {number | null} [fft_size]
 * @param {number | null} [hop_size]
 * @returns {any}
 */
export function extract_spectral_fingerprint_wasm(samples, channels, sample_rate, fft_size, hop_size) {
    const val2 = +channels;
    const val3 = +sample_rate;
    const val4 = +(isLikeNone(fft_size) ? Number.MAX_SAFE_INTEGER : (fft_size) >>> 0);
    const val5 = +(isLikeNone(hop_size) ? Number.MAX_SAFE_INTEGER : (hop_size) >>> 0);
    const ptr0 = passArrayF32ToWasm0(samples, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.extract_spectral_fingerprint_wasm(ptr0, len0, val2, val3, val4, val5);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extract waveform peaks from audio samples
 *
 * # Arguments
 * * `samples` - Audio samples (interleaved if multi-channel)
 * * `channels` - Number of audio channels
 * * `sample_rate` - Sample rate in Hz
 * * `peaks_per_second` - Number of peak values to extract per second
 *
 * # Returns
 * WaveformData object with extracted peaks
 * @param {Float32Array | number[]} samples
 * @param {number} channels
 * @param {number} sample_rate
 * @param {number | null} [peaks_per_second]
 * @returns {any}
 */
export function extract_waveform_peaks_wasm(samples, channels, sample_rate, peaks_per_second) {
    const val2 = +channels;
    const val3 = +sample_rate;
    const val4 = +(isLikeNone(peaks_per_second) ? Number.MAX_SAFE_INTEGER : (peaks_per_second) >>> 0);
    const ptr0 = passArrayF32ToWasm0(samples, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.extract_waveform_peaks_wasm(ptr0, len0, val2, val3, val4);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Format time in seconds to MM:SS or H:MM:SS string
 * @param {number} seconds
 * @returns {string}
 */
export function format_time(seconds) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.format_time(seconds);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Format time in milliseconds to MM:SS or H:MM:SS string
 * @param {number} milliseconds
 * @returns {string}
 */
export function format_time_ms(milliseconds) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.format_time_ms(milliseconds);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Get cover art from a flo file
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * Object with `mime_type` and `data` (Uint8Array) or null if no cover
 * @param {Uint8Array | number[]} data
 * @returns {any}
 */
export function get_cover_art(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_cover_art(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extract metadata from a flo file
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * JavaScript object with metadata fields (or null if no metadata)
 * @param {Uint8Array | number[]} data
 * @returns {any}
 */
export function get_metadata(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_metadata(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Get just the metadata bytes from a flo file
 *
 * # Arguments
 * * `flo_data` - flo file bytes
 *
 * # Returns
 * Raw MessagePack metadata bytes (or empty array)
 * @param {Uint8Array | number[]} flo_data
 * @returns {Uint8Array}
 */
export function get_metadata_bytes(flo_data) {
    const ptr0 = passArray8ToWasm0(flo_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_metadata_bytes(ptr0, len0);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

/**
 * Get section markers from a flo file
 *
 * # Returns
 * Array of section markers or null if none
 * @param {Uint8Array | number[]} data
 * @returns {any}
 */
export function get_section_markers(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_section_markers(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Get synced lyrics from a flo file
 *
 * # Returns
 * Array of synced lyrics objects or null if none
 * @param {Uint8Array | number[]} data
 * @returns {any}
 */
export function get_synced_lyrics(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_synced_lyrics(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Extract TOC (Table of Contents) entries from a flo file
 *
 * # Returns
 * Array of TOC entries with frame indices, byte offsets, and timestamps
 * @param {Uint8Array | number[]} flo_data
 * @returns {any[]}
 */
export function get_toc(flo_data) {
    const ptr0 = passArray8ToWasm0(flo_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_toc(ptr0, len0);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]);
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * Get waveform data from a flo file for instant visualization
 *
 * # Returns
 * WaveformData object or null if not present
 * @param {Uint8Array | number[]} data
 * @returns {any}
 */
export function get_waveform_data(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.get_waveform_data(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * does the file have metadata? (wasm binding)
 * @param {Uint8Array | number[]} flo_data
 * @returns {boolean}
 */
export function has_metadata(flo_data) {
    const ptr0 = passArray8ToWasm0(flo_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.has_metadata(ptr0, len0);
    return ret !== 0;
}

/**
 * Get information about a flo file
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * AudioInfo struct with file details
 * @param {Uint8Array | number[]} data
 * @returns {AudioInfo}
 */
export function info(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.info(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return AudioInfo.__wrap(ret[0]);
}

/**
 * Seek to a specific time in milliseconds
 *
 * # Arguments
 * * `flo_data` - Complete flo file bytes
 * * `time_ms` - Target time in milliseconds
 *
 * # Returns
 * Seek result object containing frame index, byte offset, timestamp, sample offset, and next timestamp.
 * @param {Uint8Array | number[]} flo_data
 * @param {number} time_ms
 * @returns {any}
 */
export function seek_to_time(flo_data, time_ms) {
    const val2 = +time_ms;
    const ptr0 = passArray8ToWasm0(flo_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.seek_to_time(ptr0, len0, val2);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Replace just the metadata in a flo file (convenience function)
 *
 * Takes a metadata object directly instead of MessagePack bytes.
 *
 * # Arguments
 * * `flo_data` - Original flo file bytes
 * * `metadata` - JavaScript metadata object
 *
 * # Returns
 * New flo file with updated metadata
 * @param {Uint8Array | number[]} flo_data
 * @param {any} metadata
 * @returns {Uint8Array}
 */
export function set_metadata(flo_data, metadata) {
    const ptr0 = passArray8ToWasm0(flo_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.set_metadata(ptr0, len0, metadata);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

/**
 * Set a single field in existing metadata bytes
 *
 * Uses serde to dynamically set fields - field names match FloMetadata struct.
 * For complex fields (pictures, synced_lyrics, etc.) use create_metadata_from_object.
 *
 * # Arguments
 * * `metadata` - Existing MessagePack metadata bytes (or empty for new)
 * * `field` - Field name (e.g., "title", "artist", "bpm")
 * * `value` - Field value (string, number, or null)
 *
 * # Returns
 * Updated MessagePack metadata bytes
 * @param {Uint8Array | number[] | null | undefined} metadata
 * @param {string} field
 * @param {any} value
 * @returns {Uint8Array}
 */
export function set_metadata_field(metadata, field, value) {
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = isLikeNone(metadata) ? 0 : passArray8ToWasm0(metadata, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passStringToWasm0(field, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
        throw e;
    }
    const ret = wasm.set_metadata_field(ptr0, len0, ptr1, len1, value);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

/**
 * Compute spectral similarity between two fingerprints
 *
 * # Arguments
 * * `samples1` - First audio samples
 * * `samples2` - Second audio samples
 * * `sample_rate` - Sample rate in Hz
 * * `channels` - Number of audio channels (1 or 2)
 * * `fft_size` - FFT window size (default: 2048)
 * * `hop_size` - Hop size between frames (default: fft_size/2)
 *
 * # Returns
 * Similarity score between 0.0 (completely different) and 1.0 (identical)
 * @param {Float32Array | number[]} samples1
 * @param {Float32Array | number[]} samples2
 * @param {number} sample_rate
 * @param {number} channels
 * @param {number | null} [fft_size]
 * @param {number | null} [hop_size]
 * @returns {any}
 */
export function spectral_similarity(samples1, samples2, sample_rate, channels, fft_size, hop_size) {
    const val3 = +sample_rate;
    const val4 = +channels;
    const val5 = +(isLikeNone(fft_size) ? Number.MAX_SAFE_INTEGER : (fft_size) >>> 0);
    const val6 = +(isLikeNone(hop_size) ? Number.MAX_SAFE_INTEGER : (hop_size) >>> 0);
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArrayF32ToWasm0(samples1, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArrayF32ToWasm0(samples2, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 4, 4); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 4, 4); }
        throw e;
    }
    const ret = wasm.spectral_similarity(ptr0, len0, ptr1, len1, val3, val4, val5, val6);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Remove all metadata from a flo file
 *
 * # Arguments
 * * `flo_data` - Original flo file bytes
 *
 * # Returns
 * New flo file with no metadata
 * @param {Uint8Array | number[]} flo_data
 * @returns {Uint8Array}
 */
export function strip_metadata(flo_data) {
    const ptr0 = passArray8ToWasm0(flo_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.strip_metadata(ptr0, len0);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v2;
}

/**
 * update metadata without re-encoding audio
 *
 * # Arguments
 * * `flo_data` - Original flo file bytes
 * * `new_metadata` - New MessagePack metadata bytes (use create_metadata_*)
 *
 * # Returns
 * New flo file with updated metadata
 * @param {Uint8Array | number[]} flo_data
 * @param {Uint8Array | number[]} new_metadata
 * @returns {Uint8Array}
 */
export function update_metadata(flo_data, new_metadata) {
    let ptr0, len0, ptr1, len1;
    try {
        ptr0 = passArray8ToWasm0(flo_data, wasm.__wbindgen_malloc);
        len0 = WASM_VECTOR_LEN;
        ptr1 = passArray8ToWasm0(new_metadata, wasm.__wbindgen_malloc);
        len1 = WASM_VECTOR_LEN;
    } catch (e) {
        if (ptr1) { wasm.__wbindgen_free(ptr1, len1 * 1, 1); }
        if (ptr0) { wasm.__wbindgen_free(ptr0, len0 * 1, 1); }
        throw e;
    }
    const ret = wasm.update_metadata(ptr0, len0, ptr1, len1);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    var v3 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
    return v3;
}

/**
 * Validate flo file integrity
 *
 * # Arguments
 * * `data` - flo file bytes
 *
 * # Returns
 * true if file is valid and CRC matches
 * @param {Uint8Array | number[]} data
 * @returns {boolean}
 */
export function validate(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.validate(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
}

/**
 * get lib version
 * @returns {string}
 */
export function version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.version();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_208446807d0d1e30: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_Number_ff192a72a0dcdf6d: function(arg0) {
            const ret = Number(arg0);
            return ret;
        },
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_bigint_get_as_i64_11da4b52cd0aedef: function(arg0, arg1) {
            const v = arg1;
            const ret = typeof(v) === 'bigint' ? v : undefined;
            getDataViewMemory0().setBigInt64((arg0 >>> 0) + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_boolean_get_4f1baf9a00be3c74: function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_debug_string_f249a2a76caa9a55: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_in_3f58a9d3b3a7eed2: function(arg0, arg1) {
            const ret = arg0 in arg1;
            return ret;
        },
        __wbg___wbindgen_is_bigint_5fa10641e039d3ef: function(arg0) {
            const ret = typeof(arg0) === 'bigint';
            return ret;
        },
        __wbg___wbindgen_is_function_741ff2bb612836f5: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_null_c22311b1cc228e3a: function(arg0) {
            const ret = arg0 === null;
            return ret;
        },
        __wbg___wbindgen_is_object_8b968c3ab8e96595: function(arg0) {
            const val = arg0;
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_is_string_fc456fee5d3317de: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_be5b34249ff1fc15: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_jsval_eq_38d7bfbe4cc84039: function(arg0, arg1) {
            const ret = arg0 === arg1;
            return ret;
        },
        __wbg___wbindgen_jsval_loose_eq_b2f214e2e4b30e36: function(arg0, arg1) {
            const ret = arg0 == arg1;
            return ret;
        },
        __wbg___wbindgen_number_get_934b640d0889af78: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64((arg0 >>> 0) + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_string_get_7ce8eee7fd327545: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 1, len1, true);
            getDataViewMemory0().setInt32((arg0 >>> 0) + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_4c88d8bf264fd984: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_call_40b008ba32f73991: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.call(arg1);
            return ret;
        }, arguments); },
        __wbg_done_57e08d0be6e30c02: function(arg0) {
            const ret = arg0.done;
            return ret;
        },
        __wbg_entries_7bb1459bd9b5c2b9: function(arg0) {
            const ret = Object.entries(arg0);
            return ret;
        },
        __wbg_from_eac91875c8a5ffa4: function(arg0) {
            const ret = Array.from(arg0);
            return ret;
        },
        __wbg_get_635eea311fa1a291: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_d7176cfb76d71114: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_unchecked_e6325ad374eff861: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_get_with_ref_key_fc601247060b7204: function(arg0, arg1) {
            const ret = arg0[arg1];
            return ret;
        },
        __wbg_instanceof_ArrayBuffer_12cdaa4161423e6b: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ArrayBuffer;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Uint8Array_d7aeb0dcb3108fea: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Uint8Array;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_isArray_bcf1376d0d732d08: function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        },
        __wbg_isSafeInteger_1a35ba4d31e71d38: function(arg0) {
            const ret = Number.isSafeInteger(arg0);
            return ret;
        },
        __wbg_iterator_e4c5e8f68ada7b58: function() {
            const ret = Symbol.iterator;
            return ret;
        },
        __wbg_length_186163212ffe79c3: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_6e9d2869242cabf3: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_b03a0fabb109b1e9: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_new_13de428334042d26: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_37eb45aaf5eeb820: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_7075786089b89c5e: function() {
            const ret = new Map();
            return ret;
        },
        __wbg_new_cd4348290afae586: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_from_slice_aaf85a9746711968: function(arg0, arg1) {
            const ret = new Float64Array(getArrayF64FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_from_slice_b8daf545a41c6aa0: function(arg0, arg1) {
            const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_with_length_5c0c9043ebd9ec32: function(arg0) {
            const ret = new Float32Array(arg0 >>> 0);
            return ret;
        },
        __wbg_next_178c1651c11432b3: function(arg0) {
            const ret = arg0.next;
            return ret;
        },
        __wbg_next_af5ac6a08bb0a717: function() { return handleError(function (arg0) {
            const ret = arg0.next();
            return ret;
        }, arguments); },
        __wbg_prototypesetcall_13162965d1fe7aa3: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_push_c9f4893fc209f768: function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        },
        __wbg_set_2793479888329cb6: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_set_8282f7e0d2d01336: function(arg0, arg1, arg2) {
            const ret = arg0.set(arg1, arg2);
            return ret;
        },
        __wbg_set_d0e2abd6ed08e04c: function(arg0, arg1, arg2) {
            arg0.set(getArrayF32FromWasm0(arg1, arg2));
        },
        __wbg_set_d2d33b52458e984a: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbg_set_e4b9a833d288759a: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_stringify_0a0fbf2ef722380a: function() { return handleError(function (arg0) {
            const ret = JSON.stringify(arg0);
            return ret;
        }, arguments); },
        __wbg_value_e0f328965e184931: function(arg0) {
            const ret = arg0.value;
            return ret;
        },
        __wbindgen_generic_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_generic_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
            const ret = getArrayU8FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000004: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            table.set(0, undefined);
            table.set(1024, undefined);
            table.set(1025, null);
            table.set(1026, true);
            table.set(1027, false);
        },
    };
    return {
        __proto__: null,
        "./libflo_audio_bg.js": import0,
    };
}

const AudioInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_audioinfo_free(ptr, 1));
const WasmStreamingDecoderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmstreamingdecoder_free(ptr, 1));
const WasmStreamingEncoderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmstreamingencoder_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function debugString(val) {
    switch (typeof val) {
        // primitive types
        case 'number':
        case 'boolean':
        case 'undefined':
        return `${val}`;
        case 'string':
        return JSON.stringify(val);
        case 'bigint':
        return `${val}n`;
        case 'symbol':
        return val.description !== undefined
            ? `Symbol(${val.description})`
            : 'Symbol';
        case 'function':
        return typeof val.name === 'string' && val.name !== ''
            ? `Function(${val.name})`
            : 'Function';
        case 'object': {
            if (val === null) {
                return 'null';
            }
            // objects
            if (Array.isArray(val)) {
                return '[' + Array.from(val, debugString).join(', ') + ']';
            }
            // errors
            if (val instanceof Error) {
                return `${val.name}: ${val.message}\n${val.stack}`;
            }

            const toStringOutput = toString.call(val);
            // Test for built-in
            const className = /\[object ([^\]]+)\]/.exec(toStringOutput)?.[1];

            // Failed to match the standard '[object ClassName]'
            if (className === undefined) {
                return toStringOutput;
            }
            if (className === 'Object') {
                // we're a user defined class or Object
                // JSON.stringify avoids problems with cycles, and is generally much
                // easier than looping through ownProperties of `val`.
                try {
                    return 'Object(' + JSON.stringify(val) + ')';
                } catch (_) {
                    return 'Object';
                }
            }
            // TODO we could test for more things here, like `Set`s and `Map`s.
            return className;
        }
        // Per MDN: 'This list of values is exhaustive.'
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#description
    }
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(bytes) {
    numBytesDecoded += bytes.length;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true });
        cachedTextDecoder.decode();
        numBytesDecoded = bytes.length;
    }
    return cachedTextDecoder.decode(bytes);
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedFloat64ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

let __wbg_init_promise;
async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;
    if (__wbg_init_promise === undefined) {
        __wbg_init_promise = __wbg_init_once(module_or_path);
        __wbg_init_promise.catch(() => { __wbg_init_promise = undefined; });
    }
    return __wbg_init_promise;
}

async function __wbg_init_once(module_or_path) {

    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('libflo_audio_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
