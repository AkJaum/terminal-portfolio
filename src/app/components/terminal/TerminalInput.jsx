export default function TerminalInput({ promptText, input, onInputChange, onKeyDown, disabled, readOnly, inputRef }) {
  return (
    <div className="flex mt-2">
      <span className="mr-2" style={{ color: "#8ab4ff", fontWeight: 800 }}>
        {promptText}
      </span>
      <input
        id="input"
        ref={inputRef}
        disabled={disabled}
        readOnly={readOnly}
        className="bg-transparent outline-none flex-1 caret-white text-white"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => inputRef.current?.focus()}
      />
    </div>
  );
}
