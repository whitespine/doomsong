

// Sidesteps proxying by making an exact copy that does nothing different
export function mimic(val) {
    return new Proxy(val, {});
}