export const getEditorLink = (openInEditorUrl, debugSource) => {
  const { fileName, columnNumber, lineNumber } = debugSource;
  return openInEditorUrl
    .replace("{path}", fileName || "")
    .replace("{line}", lineNumber ? lineNumber.toString() : "0")
    .replace("{column}", columnNumber ? columnNumber.toString() : "0");
};

