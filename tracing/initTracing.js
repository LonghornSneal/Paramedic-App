// tracing/initTracing.js
// Lightweight tracing initializer for the Paramedic App.
// Behavior:
// - If an OpenTelemetry tracer is present on `window.opentelemetry`, it will use that tracer.
// - Otherwise it exposes a minimal console-based tracer on `window.tracer` and a helper
//   `window.startAppSpan(name)` to create simple spans.
// This avoids adding build-time dependencies and lets you opt-in later to a full OT
// setup (CDN or local SDK + OTLP collector).

// Note: This file is an ES module so it can be imported from `main.js` early in bootstrap.

function makeConsoleTracer() {
    return {
        startSpan(name, options) {
            const start = Date.now();
            console.info(`[trace] START ${name}`, options || {});
            return {
                setAttribute(k, v) { console.info(`[trace] ATTR ${name} ${k}=${v}`); },
                addEvent(n, p) { console.info(`[trace] EVENT ${name} ${n}`, p || {}); },
                end() { console.info(`[trace] END ${name} (${Date.now() - start}ms)`); }
            };
        }
    };
}

function noopSpan() { return { end() {} }; }

// Initialize tracer and expose global helpers
try {
    let tracer;
    if (typeof window !== 'undefined' && window.opentelemetry && window.opentelemetry.trace && typeof window.opentelemetry.trace.getTracer === 'function') {
        // If an OpenTelemetry browser SDK was loaded (for example via CDN), use it.
        tracer = window.opentelemetry.trace.getTracer('paramedic-app', '1.0.0');
        console.info('Tracing: using detected OpenTelemetry tracer.');
    } else {
        tracer = makeConsoleTracer();
        console.info('Tracing: OpenTelemetry not found — using console tracer.');
    }

    // Expose a safe tracer and a helper to start spans around app lifecycle work
    window.tracer = tracer;
    window.startAppSpan = function (name) {
        try {
            return tracer.startSpan ? tracer.startSpan(name) : noopSpan();
        } catch (e) {
            console.warn('Tracing: failed to start span, returning noop span', e);
            return noopSpan();
        }
    };
} catch (err) {
    // If anything goes wrong during tracing init, fall back silently to noop helpers.
    // This is intentionally resilient so tracing cannot break the app.
    window.tracer = { startSpan() { return noopSpan(); } };
    window.startAppSpan = () => noopSpan();
    console.warn('Tracing: initialization error — tracing disabled.', err);
}

// Example automatic span around DOMContentLoaded -> initApp step (non-intrusive):
// Consumers can also call window.startAppSpan('my-work') manually.
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Create a short-lived span to indicate page load/boot
        try {
            const s = window.startAppSpan && window.startAppSpan('app.bootstrap:DOMContentLoaded');
            // end quickly in next event loop tick to avoid long-running spans
            if (s && typeof s.end === 'function') setTimeout(() => s.end(), 0);
        } catch (e) { /* ignore */ }
    }, { once: true });
}
