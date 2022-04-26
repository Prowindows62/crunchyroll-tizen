var keyboard = {
  id: "keyboard-screen",
  previus: null,
  selected: [0, 0],
  input: null,
};

keyboard.init = function (element) {
  this.input = element;
  var values = [
    {
      keys: [
        { value: "Q", number: "1", size: 1 },
        { value: "W", number: "2", size: 1 },
        { value: "E", number: "3", size: 1 },
        { value: "R", number: "4", size: 1 },
        { value: "T", number: "5", size: 1 },
        { value: "Y", number: "6", size: 1 },
        { value: "U", number: "7", size: 1 },
        { value: "I", number: "8", size: 1 },
        { value: "O", number: "9", size: 1 },
        { value: "P", number: "0", size: 1 },
      ],
    },
    {
      keys: [
        { value: "A", number: "@", size: 1 },
        { value: "S", number: "#", size: 1 },
        { value: "D", number: "$", size: 1 },
        { value: "F", number: "_", size: 1 },
        { value: "G", number: "&", size: 1 },
        { value: "H", number: "-", size: 1 },
        { value: "J", number: "+", size: 1 },
        { value: "K", number: "(", size: 1 },
        { value: "L", number: ")", size: 1 },
      ],
    },
    {
      keys: [
        { value: "", number: "", size: "alpha" },
        { value: "Z", number: ".", size: 1 },
        { value: "X", number: "¿", size: 1 },
        { value: "C", number: "?", size: 1 },
        { value: "V", number: "¡", size: 1 },
        { value: "B", number: "!", size: 1 },
        { value: "N", number: ";", size: 1 },
        { value: "M", number: ":", size: 1 },
        { value: "Ñ", number: ",", size: 1 },
        { value: "", number: "", size: "backspace" },
      ],
    },
    {
      keys: [
        { value: "1 2 3", number: "A B C", size: 2 },
        { value: "", number: "", size: 5 },
        { value: "", number: "", size: "ok" },
      ],
    },
  ];

  var keyboard_element = document.createElement("div");
  keyboard_element.id = this.id;

  var htmlString = "";

  for (const item of values) {
    htmlString += `
    <div class="${this.id}-option row">
    `;

    for (const key of item.keys) {
      htmlString += `
      <div class="col size-${key.size}" alter="${key.number}">
        ${key.value.toLocaleLowerCase()}
      </div>`;
    }

    htmlString += `
    </div>`;
  }

  keyboard_element.innerHTML = htmlString;
  document.body.appendChild(keyboard_element);

  this.move(this.selected);
  this.previus = main.state;
  main.state = this.id;
};

keyboard.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
  main.state = this.previus;
};

keyboard.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
      this.destroy();
      break;
    case tvKey.KEY_UP:
      if (this.selected[0] > 0) {
        this.move([this.selected[0] - 1, this.selected[1]]);
      }
      break;
    case tvKey.KEY_DOWN:
      var max =
        this.selected[0] + 1 == 1 ? 8 : this.selected[0] + 1 == 3 ? 2 : 9;
      if (this.selected[0] < 3) {
        this.move([
          this.selected[0] + 1,
          this.selected[1] > max ? max : this.selected[1],
        ]);
      }
      break;
    case tvKey.KEY_LEFT:
      if (this.selected[1] > 0) {
        this.move([this.selected[0], this.selected[1] - 1]);
      }
      break;
    case tvKey.KEY_RIGHT:
      var max = this.selected[0] == 1 ? 8 : this.selected[0] == 3 ? 2 : 9;
      if (this.selected[1] < max) {
        this.move([this.selected[0], this.selected[1] + 1]);
      }
      break;
    case tvKey.KEY_ENTER:
      this.action(this.selected);
      break;
  }
};

keyboard.move = function (selected) {
  this.selected = selected;
  var options = document.getElementsByClassName(this.id + "-option");
  for (var i = 0; i < options.length; i++) {
    var cols = options[i].children;
    for (var a = 0; a < cols.length; a++) {
      if (i == selected[0] && a == selected[1]) {
        cols[a].className = cols[a].className + " selected";
      } else {
        cols[a].className = cols[a].className.replace(" selected", "");
      }
    }
  }
};

keyboard.action = function (selected) {
  switch (selected[0] + "" + selected[1]) {
    case "20":
      this.upperCase();
      break;
    case "30":
      this.change();
      break;
    case "31":
      this.input.value = this.input.value + " ";
      break;
    case "32":
      this.destroy();
      break;
    case "29":
      this.input.value = this.input.value.slice(0, -1);
      break;
    default:
      console.log(this.input);
      this.input.value =
        this.input.value +
        document.getElementsByClassName(this.id + "-option")[selected[0]]
          .children[selected[1]].innerText;
      break;
  }
};

keyboard.upperCase = function () {
  var options = document.getElementsByClassName(this.id + "-option");
  var type =
    options[0].children[0].innerText.toUpperCase() ==
    options[0].children[0].innerText;
  for (const option of options) {
    for (const child of option.children) {
      child.innerText = type
        ? child.innerText.toLowerCase()
        : child.innerText.toUpperCase();
    }
  }
};

keyboard.change = function () {
  var options = document.getElementsByClassName(this.id + "-option");
  for (const option of options) {
    for (const child of option.children) {
      var newAlter = child.innerText;
      child.innerText = child.getAttribute("alter");
      child.setAttribute("alter", newAlter);
    }
  }
};