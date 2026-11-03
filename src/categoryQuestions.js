
const categoryQuestions = {
  HTML: [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Text Machine Language",
        "Hyperlinks Text Mark Language",
        "Home Tool Markup Language"
      ],
      answer: "Hyper Text Markup Language"
    },
    {
      question: "Which tag creates a paragraph?",
      options: ["<h1>", "<p>", "<br>", "<div>"],
      answer: "<p>"
    },
    {
      question: "Which tag inserts an image?",
      options: ["<image>", "<img>", "<picture>", "<src>"],
      answer: "<img>"
    },
    {
      question: "Which tag creates a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      answer: "<a>"
    },
    {
      question: "Which tag creates an unordered list?",
      options: ["<ol>", "<li>", "<ul>", "<list>"],
      answer: "<ul>"
    }
  ],

  CSS: [
    {
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style System",
        "Colorful Style Sheets"
      ],
      answer: "Cascading Style Sheets"
    },
    {
      question: "Which property changes text color?",
      options: ["background", "font-size", "color", "text-style"],
      answer: "color"
    },
    {
      question: "Which symbol selects an ID in CSS?",
      options: [".", "#", "*", "&"],
      answer: "#"
    },
    {
      question: "Which property changes background color?",
      options: ["color", "background-color", "font-color", "style"],
      answer: "background-color"
    },
    {
      question: "Which CSS property makes text bold?",
      options: [
        "font-style",
        "text-align",
        "font-weight",
        "text-decoration"
      ],
      answer: "font-weight"
    }
  ],

  JavaScript: [
    {
      question: "Which keyword declares a variable?",
      options: ["int", "var", "string", "define"],
      answer: "var"
    },
    {
      question: "Which symbol is used for comments?",
      options: ["//", "##", "<!-- -->", "**"],
      answer: "//"
    },
    {
      question: "Which method displays a message?",
      options: ["alert()", "display()", "print()", "show()"],
      answer: "alert()"
    },
    {
      question: "Which data type represents true or false?",
      options: ["String", "Number", "Boolean", "Array"],
      answer: "Boolean"
    },
    {
      question: "Which operator checks strict equality?",
      options: ["=", "==", "===", "!="],
      answer: "==="
    }
  ],

  "React.js": [
    {
      question: "What is React?",
      options: [
        "A database",
        "A JavaScript library",
        "An operating system",
        "A programming language"
      ],
      answer: "A JavaScript library"
    },
    {
      question: "Which hook manages state?",
      options: ["useEffect", "useState", "useRef", "useMemo"],
      answer: "useState"
    },
    {
      question: "What is JSX?",
      options: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JSON XML",
        "JavaScript Extra"
      ],
      answer: "JavaScript XML"
    },
    {
      question: "Which method is used to render lists?",
      options: ["filter()", "map()", "reduce()", "find()"],
      answer: "map()"
    },
    {
      question: "What is a React component?",
      options: [
        "A reusable UI building block",
        "A database table",
        "A CSS property",
        "A browser"
      ],
      answer: "A reusable UI building block"
    }
  ]
};

export default categoryQuestions;
