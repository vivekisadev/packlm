import React, { useState } from 'react';

export default function CodeBlock({ title, code, langClass = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="cb">
      <div className="cb-head">
        <span className="cb-lang">{title}</span>
        <button className={`btn-copy ${copied ? 'ok' : ''}`} onClick={handleCopy}>
          {copied ? 'copied!' : 'copy'}
        </button>
      </div>
      <pre className={`cc2 ${langClass}`}>
        {code}
      </pre>
    </div>
  );
}
