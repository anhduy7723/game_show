class Game {
  constructor() {
    this.stageLength = 1;
    this.answeredQuestion = [];
    this.gameLength = $(".stages button").length;
    this.pLen = this.gameLength;
    this.amount = $(".stages button").eq(this.pLen - 1).html();
    this.enableAskAudienceLifeline = true;
    this.enableCallFriendLifeline = true;
    this.enableFiftyFiftyLifeline = true;
    this.play = true;
    this.selected = "";
    this.currentQuestionIndex = 0; // Thêm biến này để theo dõi câu hỏi hiện tại
    this.currentQuestionSet = "stage1"; // Mặc định là bộ câu hỏi 1
    this.answer = "";
    this.isCountdownPlaying = false;
    this.countdown = 45; // Countdown timer in seconds
    this.countdownInterval = null; // Reference to the countdown interval
  }

  stopCountdownAudio() {
    const audio = document.getElementById("countdown-audio");
    audio.pause();
    audio.currentTime = 0;
    this.isCountdownPlaying = false;
  }

  changeQuestionStageData(data) {
    let div;
    $(".options").empty();
    $(".question").html(data["question"]);
    data["options"].map((option, i) => {
      div = `<div class="${option.slice(0, 1)} opt" key="${i}">${option}</div>`;
      $(".options").append(div);
    });

    $(".opt").click((e) => {
      this.selected = e.target.textContent.slice(0, 1);
      $(".modal").fadeIn(300);
      $(".warning").fadeIn(300);
    });

    this.answer = data["ans"];
  }

  startCountdown() {
    clearInterval(this.countdownInterval);
    $(".countdown").text(this.countdown);

    this.countdownInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown >= 0) {
        $(".countdown").text(this.countdown);

        if (this.countdown === 45 && !this.isCountdownPlaying) {
          const audio = document.getElementById("countdown-audio");
          audio.play();
          this.isCountdownPlaying = true;
        }
      } else {
        clearInterval(this.countdownInterval);
        $(".modal").fadeOut();
        this.isCountdownPlaying = false;
        this.displayTimeUpMessage();
      }
    }, 1000);
  }

  displayTimeUpMessage() {
    $(".modal").fadeIn(500);
    $(".warning").fadeIn(500).text("Hết giờ");

    setTimeout(() => {
      $(".warning").fadeOut(500, () => {
        $(".modal").fadeOut(500);
        this.resetGame();
        playWelcomeMusic();
      });
    }, 1000);
    this.stopCountdownAudio();
  }

  selectQuestion() {
    this.countdown = 45;
    const countdownAudio = document.getElementById("countdown-audio");
    clearInterval(this.countdownInterval);

    if (!countdownAudio.paused) {
      countdownAudio.pause();
      countdownAudio.currentTime = 0;
    }

    $(".ready-btn").click(() => {
      $("#start_or_noStart").hide();
      $("#game").show();
      countdownAudio.play();
      this.startCountdown();
    });

    let questionData;
    switch (this.currentQuestionSet) {
      case "stage1":
        questionData = stages.stage1.data[this.currentQuestionIndex];
        break;
      case "stage2":
        questionData = stages.stage2.data[this.currentQuestionIndex];
        break;
      case "stage3":
        questionData = stages.stage3.data[this.currentQuestionIndex];
        break;
      case "stage4":
        questionData = stages.stage4.data[this.currentQuestionIndex];
        break;
      case "stage5":
        questionData = stages.stage5.data[this.currentQuestionIndex];
        break;
      case "stage6":
        questionData = stages.stage6.data[this.currentQuestionIndex];
        break;
      case "stage7":
        questionData = stages.stage7.data[this.currentQuestionIndex];
        break;
      case "stage8":
        questionData = stages.stage8.data[this.currentQuestionIndex];
        break;
      case "stage9":
        questionData = stages.stage9.data[this.currentQuestionIndex];
        break;
      case "stage10":
        questionData = stages.stage10.data[this.currentQuestionIndex];
        break;
      default:
        questionData = stages.stage1.data[this.currentQuestionIndex];
        break;
    }

    this.changeQuestionStageData(questionData);
    this.currentQuestionIndex++;

    // Kiểm tra nếu đã hoàn thành tất cả câu hỏi của bộ câu hỏi hiện tại
    if (this.currentQuestionIndex >= stages[this.currentQuestionSet].data.length) {
    }
  }

  start() {
    $(".welcome").fadeOut(500, () => {
      $("#game").fadeIn(500);
      this.selectQuestion();
    });
  }

  displaySuccessMessage() {
    $(".right-wrapper").fadeIn(800);
    $("#right").html(`Chúc mừng!!! Bạn vừa thắng ${this.amount}`);

    setTimeout(() => {
      $("#right").html("Chuẩn bị cho câu hỏi tiếp theo");
    }, 1800);

    setTimeout(() => {
      $(".right-wrapper").fadeOut(800, () => {
        $("#right").html("");
      });
    }, 3800);

    setTimeout(() => {
      $(".modal").fadeOut();
    }, 4500);
  }

  handleReadyButtonClick() {
    // Loại bỏ sự kiện click sau khi đã sử dụng nó một lần
    $(".ready-btn").off("click");
    this.countdownAudiA;
    $(".ready-btn").click(() => {
      $("#start_or_noStart").hide();
      $("#game").show();
      countdownAudio.play();

      // Kiểm tra nếu countdownAudio đã dừng và trò chơi đang chạy, thì mới phát lại
      const countdownAudio = document.getElementById("countdown-audio");
      if (countdownAudio.paused && this.play) {
        countdownAudio.play();
      }

      this.startCountdown(); // Bắt đầu countdown khi bắt đầu câu hỏi mới.
    });
  }

  rightAnswer() {
    const audio = document.getElementById("correct-audio");
    audio.play();
    if (this.stageLength < 15) {
      this.stageLength++;
      this.answeredQuestion =
        this.stageLength % 6 == 0 || this.stageLength % 11 == 0
          ? []
          : this.answeredQuestion;
      this.amount = $(".stages button").eq(this.pLen - 1).html();

      this.displaySuccessMessage();

      this.pLen--;
      $(".current").removeClass("current");
      $(".stages button").eq(this.pLen).addClass("current");
      $(".score").html("Score: " + this.amount);
      this.gameLength++;

      setTimeout(() => {
        if (this.stageLength < 15) {
          this.selectQuestion(); // Chỉ chọn câu hỏi mới khi trò chơi chưa kết thúc
          // Nếu trò chơi chưa kết thúc, hiển thị lại thông báo "Bạn đã sẵn sàng"
          $("#start_or_noStart").show();
          game.stopCountdownAudio();
        } else {
          this.displayWinnerMessage();
        }
      }, 4500);
    } else {
      this.displayWinnerMessage();
    }
  }

  displayWinnerMessage() {
    $(".right-wrapper").fadeIn(800);
    $("#right").html("Bạn là người chiến thắng!!!");
    setTimeout(() => {
      $("#right").html("Chúc mừng!!! Bây giờ bạn là một triệu phú ");
    }, 1800);
    setTimeout(() => {
      $(".right-wrapper").fadeOut(800, () => {
        $("#right").html("");
        this.resetGame();
        playWelcomeMusic();
      });
    }, 2300);
  }

  wrongAnswer() {
    const audio = document.getElementById("wrong-audio");
    audio.play();
    $(".wrong-wrapper").fadeIn(800);

    setTimeout(() => {
      $("#wrong").html(
        `Xin lỗi, bạn đã chọn sai!!!<br>Câu trả lời đúng là: ${this.answer}<br>Bạn đang rời đi với ${this.amount}`
      );
    }, 100);

    setTimeout(() => {
      $(".wrong-wrapper").fadeOut(() => {
        $("#wrong").html("");
        $(".modal").fadeOut(800);
      });
    }, 2500);

    setTimeout(() => {
      this.displayGameStatusMessage(`Chúc bạn may mắn lần sau! Bạn rời đi với ${this.amount}`);
    }, 3500);

    setTimeout(() => {
      this.resetGame();
    }, 4500);

    this.stopCountdownAudio();
  }

  fiftyFiftyLifeline() {
    var options = ["D", "A", "C", "B"];
    var removedOptions = [];
    $(".fifty")
      .attr({ src: "images/fifty2.png" })
      .css("cursor", "default");
    $(".fifty:hover").css("background-color", "rgb(17, 17, 138)");
    this.enableFiftyFiftyLifeline = false;

    for (var i = 0; i < options.length; i++) {
      if (options[i] != this.answer) {
        if (removedOptions.length < 2) {
          removedOptions.push(options[i]);
          for (var i = 0; i < removedOptions.length; i++) {
            $(`div.${removedOptions[i]}`).html(`${removedOptions[i]}:`);
          }
        }
      }
    }
  }

  callFriendLifeline() {
    let friendRandomNumber = Math.floor(Math.random() * 7);
    let friendRandomResponse = Math.floor(Math.random() * 4);
    let friends = [
      "Hoàng",
      "Duy",
      "Thái",
      "Phi",
      "Đạt",
      "Khánh",
      "D",
    ];
    let confidencePercentage = ["100%", "80%", "60%", "50%", "30%"];
    let responseMessage = [
      "Tôi chắc chắn nó",
      "Nó chắc chắn      ",
      "Nó chắc chắn",
      "Tôi nghĩ nó là",
      "Không chắc chắn để lựa chọn",
    ];

    $(".call")
      .attr({ src: "images/call2.png" })
      .css("cursor", "default");
    $(".call:hover").css("background-color", "rgb(17, 17, 138)");
    $(".modal").fadeIn();
    $(".chat-wrapper").fadeIn(500);

    this.displayGameStatusMessage("Đang gọi... ☎", 100);
    this.displayGameStatusMessage("Đã kết nối ✔", 2000);

    setTimeout(() => {
      const playerMessage = `TÔI: Xin chào ${friends[friendRandomNumber]}. 😞Bây giờ tôi đang ngồi trên ghế nóng và tôi cần câu trả lời cho câu hỏi này.<br>${$(
        ".question"
      ).html()}`;
      this.displayGameStatusMessage(playerMessage);
    }, 3800);

    setTimeout(() => {
      this.displayGameStatusMessage(`${friends[friendRandomNumber]}: Suy nghĩ...`);
    }, 7000);

    setTimeout(() => {
      const message = `${friends[friendRandomNumber]}: ${
        responseMessage[friendRandomResponse]
      } ${this.answer}.`;
      this.displayGameStatusMessage(message);
    }, 10000);

    setTimeout(() => {
      this.displayGameStatusMessage("TÔI: Làm thế nào chắc chắn là bạn?");
    }, 13000);

    setTimeout(() => {
      const message = `${friends[friendRandomNumber]}: ${
        confidencePercentage[friendRandomResponse]
      } sure.`;
      this.displayGameStatusMessage(message);
    }, 16000);

    setTimeout(() => {
      $(".chat-wrapper").fadeOut(800, () => {
        this.displayGameStatusMessage("");
        $(".modal").fadeOut();
        this.enableCallFriendLifeline = false;
      });
    }, 18000);
  }

  askAudienceLifeline() {
    $(".aud")
      .attr({ src: "images/aud2.png" })
      .css("cursor", "default");
    $(".aud:hover").css("background-color", "rgb(17, 17, 138)");
    $(".modal").fadeIn();
    $(".chat-wrapper").fadeIn(500);

    setTimeout(() => {
      this.displayGameStatusMessage("Đặt câu hỏi cho khán giả...");
    }, 100);

    setTimeout(() => {
      this.displayGameStatusMessage("Suy nghĩ của khán giả...");
    }, 1200);

    setTimeout(() => {
      $(".chat-wrapper").fadeOut();
      this.displayGameStatusMessage("");
      $(".audience-wrapper").fadeIn();
      this.enableAskAudienceLifeline = false;
    }, 2700);

    var options = ["D", "A", "C", "B"];
    var audiencePercentage = ["15", "32", "48", "54", "60"];

    for (var i = 0; i < options.length; i++) {
      if (options[i] != this.answer) {
        $(`.bar-${options[i]}`).css("width", `${audiencePercentage[i]}%`);
      } else {
        var highestPercentage =
          Number(audiencePercentage[4]) +
          Math.floor(Math.random() * (23 - 10)) +
          10;
        $(`.bar-${this.answer}`).css("width", `${highestPercentage}%`);
      }
    }

    $(".closeBtn").click(() => {
      $(".audience-wrapper").fadeOut();
      $(".modal").fadeOut();
    });
  }

  displayGameStatusMessage(message, timeout) {
    if (!timeout) {
      $("#chat").html(message);
      return;
    }
    setTimeout(() => {
      $("#chat").html(message);
    }, timeout);
  }

  resetGame() {
    $(".modal").fadeOut();
    $("#game").hide();
    this.countdown = 45;
    this.enableCallFriendLifeline = true;
    this.enableAskAudienceLifeline = true;
    this.enableFiftyFiftyLifeline = true;
    this.stageLength = 1;
    this.answeredQuestion = [];
    this.gameLength = $(".stages button").length;
    this.pLen = this.gameLength;
    this.amount = $(".stages button").eq(this.pLen - 1).html();
    $(".welcome").fadeIn(600);
    $("#start_or_noStart").fadeIn();

    $(".ready-btn").click(() => {
      $("#start_or_noStart").hide();
      $("#game").show();
      game.stopCountdownAudio();
      game.startCountdown();
    });

    $(".fifty")
      .attr({ src: "images/fifty.png", onClick: "game.fiftyFiftyLifeline()" })
      .css("cursor", "pointer");
    $(".call")
      .attr({ src: "images/call.png", onClick: "game.callFriendLifeline()" })
      .css("cursor", "pointer");
    $(".aud")
      .attr({ src: "images/aud.png", onClick: "game.askAudienceLifeline()" })
      .css("cursor", "pointer");
  }
}

(function initGame() {
  const game = new Game();

  function playWelcomeMusic() {
    const welcomeAudio = document.getElementById("welcome-music");
    welcomeAudio.loop = true;
    welcomeAudio.play();
  }

  function stopWelcomeMusic() {
    const welcomeAudio = document.getElementById("welcome-music");
    welcomeAudio.pause();
    welcomeAudio.currentTime = 0;
  }

  $("#question-set").change(function () {
    game.currentQuestionSet = $(this).val(); // Cập nhật bộ câu hỏi hiện tại
    // Có thể thực hiện các hành động khác sau khi thay đổi bộ câu hỏi
  });

  $(".ready-btn").click(() => {
    $("#start_or_noStart").hide();
    $("#game").show();
    game.stopCountdownAudio();
    game.startCountdown();
  });

  $(".no").click(() => {
    $(".modal").fadeOut();
  });

  $(".yes").click(() => {
    $(".warning").fadeOut(500, () => {
      game.selected == game.answer ? game.rightAnswer() : game.wrongAnswer();
      game.startCountdown();
    });
  });

  $(".about-btn").click(() => {
    $(".about").fadeIn(1000);
  });

  $(".fifty").click(() => {
    if (game.enableFiftyFiftyLifeline) game.fiftyFiftyLifeline();
  });

  $(".call").click(() => {
    if (game.enableCallFriendLifeline) game.callFriendLifeline();
  });

  $(".aud").click(() => {
    if (game.enableAskAudienceLifeline) game.askAudienceLifeline();
  });

  $(".start-btn").click(() => {
    stopWelcomeMusic();
    game.stopCountdownAudio();
    game.start();
  });

  $(document).ready(() => {
    playWelcomeMusic();
  });
})();
