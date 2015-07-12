// Ensure that console.log and console.error don't cause errors
export var console = window.console || {};
console.log = console.log || (() => {
    });
console.error = console.error || console.log;
