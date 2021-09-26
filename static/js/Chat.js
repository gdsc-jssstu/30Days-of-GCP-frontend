/*chatbot button and ui space*/
class InteractiveChatbox {
  constructor(a, b, c) {
    this.args = {
      button: a,
      chatbox: b,
    };
    this.icons = c;
    this.state = false;
  }

  display() {
    const { button, chatbox } = this.args;

    button.addEventListener("click", () => this.toggleState(chatbox));
  }

  toggleState(chatbox) {
    this.state = !this.state;
    this.showOrHideChatBox(chatbox, this.args.button);
  }

  showOrHideChatBox(chatbox, button) {
    if (this.state) {
      chatbox.classList.add("chatbox--active");
      this.toggleIcon(true, button);
    } else if (!this.state) {
      chatbox.classList.remove("chatbox--active");
      this.toggleIcon(false, button);
    }
  }

  toggleIcon(state, button) {
    const { isClicked, isNotClicked } = this.icons;
    let b = button.children[0].innerHTML;

    if (state) {
      button.children[0].innerHTML = isClicked;
    } else if (!state) {
      button.children[0].innerHTML = isNotClicked;
    }
  }
}

const chatButton = document.querySelector(".chatbox__button");
const chatContent = document.querySelector(".chatbox__support");
const icons = {
  isClicked: '<img src="./static/images/bluechat.svg" />',
  isNotClicked: '<img src="./static/images/bluechat.svg" />',
};
const chatbox = new InteractiveChatbox(chatButton, chatContent, icons);
chatbox.display();
chatbox.toggleIcon(false, chatButton);

/*chatbot logic*/
var form = document.getElementById("form");
form.addEventListener("submit", handleForm);
var history_element = document.getElementsByClassName("chatbox__messages")[0];
var user_input = document.getElementById("user_input");

function handleForm(event) {
  event.preventDefault();

  let new_msg = document.createElement("div");
  let user_msg_element = document.createElement("div");
  user_msg_element.className = "chatbox1";
  user_msg_element.append(user_input.value);
  user_msg_element.appendChild(document.createElement("br"));
  new_msg.appendChild(user_msg_element);
  history_element.insertBefore(new_msg, history_element.firstChild);

  const data = new URLSearchParams();
  for (const pair of new FormData(form)) {
    data.append(pair[0], pair[1]);
  }

  const controller = new AbortController();

  // 5 second timeout:
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  fetch("https://gcp-chatbot.herokuapp.com/chat", {
    method: "POST",
    body: data,
    signal: controller.signal,
  })
    .then((r) => r.json())
    .then((data) => {
      let bot_msg_element = document.createElement("div");
      bot_msg_element.className = "chatbox2";
      bot_msg_element.append(data["answer"]);
      bot_msg_element.appendChild(document.createElement("br"));

      history_element.insertBefore(bot_msg_element, history_element.firstChild);
      user_input.value = "";
    })
    .catch(function (err) {
      let bot_msg_element = document.createElement("div");
      bot_msg_element.className = "chatbox2";
      bot_msg_element.append(
        ` Bot is coming online! Please wait for a minute before trying again.`
      );
      bot_msg_element.appendChild(document.createElement("br"));

      history_element.insertBefore(bot_msg_element, history_element.firstChild);
      user_input.value = "";
    });
}
