const splitChar = ';';
const createRef = (word) => {
  const words = word.split(splitChar);
  if (words.length > 2) {
    return `const ${words[0]}Ref = React.useRef(${words[1]});`;
  }
  return `const ${words[0]}Ref = React.useRef();`;
};

const createEffect = (word) => {
  const words = word.split(splitChar);
  if (words.length > 1) {
    const params = words.filter((word, index) => (index !== words.length -1)).join(', ');
    return `React.useEffect(() => { }, [${params}]);`;
  }
  return 'React.useEffect(() => { }, []);';
};

const createState = (word) => {
  const words = word.split(splitChar);
  const words0 = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  if (words.length > 2) {
    return `const [${words[0]}, set${words0}] = React.useState(${words[1]});`;
  }
  return `const [${words[0]}, set${words0}] = React.useState();`;
};

const createClass = () => {

};

const createFuncConst = (currentWord) => {
  const words = currentWord.split(splitChar);
  if (words.length < 3) {
    return `const ${words[0]} = () => { 
    };`;
  }
  const params = words.filter((word, index) => (index !== 0 && index !== words.length -1)).join(', ');
  return `const ${words[0]} = (${params}) => { 
  };`;
};

const createFunction = (word) => {
  const words = word.split(splitChar);
  const words0 = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  if (words.length > 2) {
    return `const ${words[0]}Ref = React.useRef(${words[1]});`;
  }

  return "import React from 'react';\n" +
    "import PkPageHeader from '@/common/component/base/pk-page-header/PkPageHeader';\n" +
    "\n" +
    "function Train({ title }) {\n" +
    "  return (\n" +
    "    <div className=\"home-wrap\">\n" +
    "      <PkPageHeader title={ title }/>\n" +
    "      <div className=\"px-5\">\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  );\n" +
    "}\n" +
    "\n" +
    "export default Train;\n";
};

function onTab([word, current, fs]) {
  if (word.endsWith(`${splitChar}s`)) {
    return createState(word);
  }

  if (word.endsWith(`${splitChar}r`)) {
    return createRef(word);
  }

  if (word.endsWith(`${splitChar}e`)) {
    return createEffect(word);
  }

  if (word.endsWith(`${splitChar}class`)) {
    return createClass(word);
  }

  if (word.endsWith(`${splitChar}cf`)) {
    return createFunction(word);
  }

  if (word.endsWith(`${splitChar}f`)) {
    return createFuncConst(word);
  }

  return `${word}  `;
}

module.exports = {
  onTab
}
