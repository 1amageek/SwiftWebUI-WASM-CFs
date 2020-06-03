import { SwiftRuntime } from "javascript-kit-swift";
import { WASI } from "@wasmer/wasi";
import { WasmFs } from "@wasmer/wasmfs";
import { inflate } from "pako";

const swift = new SwiftRuntime();
// Instantiate a new WASI Instance
const wasmFs = new WasmFs();
let wasi = new WASI({
  args: [],
  env: {},
  bindings: {
    ...WASI.defaultBindings,
    fs: wasmFs.fs
  }
});

const startWasiTask = async () => {
  // Fetch our Wasm File
  console.log("Running task");
  const response = await fetch("/wasm/SwiftWASM.wasm.gz");
  const responseArrayBuffer = await response.arrayBuffer();

  // Instantiate the WebAssembly file
  const wasm_bytes = inflate(new Uint8Array(responseArrayBuffer)).buffer;
  let { instance } = await WebAssembly.instantiate(wasm_bytes, {
    wasi_snapshot_preview1: wasi.wasiImport,
    javascript_kit: swift.importObjects(),
  });

  swift.setInsance(instance);
  // Start the WebAssembly WASI instance!
  wasi.start(instance);

  // Output what's inside of /dev/stdout!
  const stdout = await wasmFs.getStdOut();
  console.log(stdout);
};
startWasiTask();

window.SwiftUIFetch = async (url, then, err) => {
    try {
        const res = await fetch(url);
        const text = await res.text();
        then(text);
        window.SwiftUIPossibleStateChange();
    } catch (error) {
        err(error);
        window.SwiftUIPossibleStateChange();
    }
}

window.SwiftUIHandleJSON = function(change) {
//  console.log(json);
//  if (json.changes !== undefined) {
//    for (var i = 0; i < json.changes.length; i++) {
//      const change  = json[i];
      const element = document.getElementById(change.id);
      switch (change.type) {
        case "replace-element":
          if (element) { element.outerHTML = change.content; }
          else { console.error("Missing element for change:", change.id); }
          break;
        case "replace-content":
          if (element) { element.innerHTML = change.content; }
          else { console.error("Missing element for change:", change.id); }
          break;
        case "delete-element":
          if (element) { element.remove() }
          else { console.error("Missing element for change:", change.id); }
          break;

        case "insert-element":
          const t = document.createElement("template");
          t.innerHTML = change.content;
          const r = t.content.cloneNode(true);
          const pred = element
                     ? element.nextSibling
                     : element.parentNode.firstChild;
          element.parentNode.insertBefore(r, pred);
          break;

        case "order-child":
          if (element) {
            const afterElement = document.getElementById(change.after);
            const pred = afterElement
                       ? afterElement.nextSibling
                       : element.parentNode.firstChild;
            element.parentNode.insertBefore(element, pred);
          }
          else { console.error("Missing element for change:", change.id); }
          break;

        case "set-attribute":
          if (element) {
            element.setAttribute(change.attribute, change.content);
          }
          else { console.error("Missing element for change:", change.id); }
          break;
        case "delete-attribute":
          if (element) { element.removeAttribute(change.attribute); }
          else { console.error("Missing element for change:", change.id); }
        break;

        case "add-class":
          if (element) { element.classList.add(change.content); }
          else { console.error("Missing element for change:", change.id); }
          break;
        case "remove-class":
          if (element) { element.classList.remove(change.content); }
          else { console.error("Missing element for change:", change.id); }
          break;

        case "select-one-option":
          if (element) {
            element.value = change.option;
          }
          else { console.error("Missing element for change:", change.id); }
          break;

        default:
          console.log("Unexpected change:", change);
      }
//    }
//  }
}
