var albumString = "";
var rankedSongsString = "";

var namMember = Object.keys(metadata);

var lstMember = new Array();
var parent = new Array();
var equal = new Array();
var rec = new Array();
var cmp1, cmp2;
var head1, head2;
var nrec;
var numQuestion;
var totalSize;
var finishSize;
var finishFlag;

var prevStates = [];

try {
  var lsPrevStates = JSON.parse(localStorage.prevStates);
  prevStates = Array.isArray(lsPrevStates) ? lsPrevStates : [];
} catch {
  console.info("No saved data found!");
}

// To store previous states for undo and cache for accidental refresh
console.log(prevStates);

// Save current state for undo functionality
function saveState() {
  prevStates.push({
    lstMember: JSON.parse(JSON.stringify(lstMember)),
    parent: JSON.parse(JSON.stringify(parent)),
    equal: JSON.parse(JSON.stringify(equal)),
    rec: JSON.parse(JSON.stringify(rec)),
    cmp1: cmp1,
    cmp2: cmp2,
    head1: head1,
    head2: head2,
    nrec: nrec,
    numQuestion: numQuestion,
    finishSize: finishSize,
    finishFlag: finishFlag,
    totalSize: totalSize,
  });
  localStorage.setItem("prevStates", JSON.stringify(prevStates));
}

// Restore the previous state
function undoLastAction() {
  if (prevStates.length > 0) {
    var prevState = prevStates.pop();
    lstMember = prevState.lstMember;
    parent = prevState.parent;
    equal = prevState.equal;
    rec = prevState.rec;
    cmp1 = prevState.cmp1;
    cmp2 = prevState.cmp2;
    head1 = prevState.head1;
    head2 = prevState.head2;
    nrec = prevState.nrec;
    numQuestion = prevState.numQuestion;
    finishSize = prevState.finishSize;
    finishFlag = prevState.finishFlag;
    showImage(true);
  }
}

function ohOkNvm() {
  document.getElementById("restartPrompt").style = "display: none;";
  document.getElementById("restartButton").style =
    "display: flex; justify-content: center; margin-top: 10px;";
}

function restart() {
  localStorage.removeItem("prevStates");
  window.location.reload();
}

function restartQuestion() {
  document.getElementById("restartButton").style = "display: none;";
  document.getElementById("restartPrompt").style =
    "display: flex; justify-content: center;";
}

function restoreList() {
  var prevState = prevStates[prevStates.length - 1];
  lstMember = JSON.parse(JSON.stringify(prevState.lstMember));
  parent = JSON.parse(JSON.stringify(prevState.parent));
  equal = JSON.parse(JSON.stringify(prevState.equal));
  rec = JSON.parse(JSON.stringify(prevState.rec));
  cmp1 = prevState.cmp1;
  cmp2 = prevState.cmp2;
  head1 = prevState.head1;
  head2 = prevState.head2;
  nrec = prevState.nrec;
  numQuestion = prevState.numQuestion - 1;
  finishSize = prevState.finishSize;
  finishFlag = prevState.finishFlag;
  totalSize = prevState.totalSize;
}

// The initialization of the variable
function initList() {
  if (prevStates.length > 0) {
    restoreList();
    return;
  }
  var n = 0;
  var mid;
  var i;
  lstMember[n] = new Array();
  for (i = 0; i < namMember.length; i++) {
    lstMember[n][i] = i;
  }
  parent[n] = -1;
  totalSize = 0;
  n++;
  for (i = 0; i < lstMember.length; i++) {
    if (lstMember[i].length >= 2) {
      mid = Math.ceil(lstMember[i].length / 2);
      lstMember[n] = new Array();
      lstMember[n] = lstMember[i].slice(0, mid);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
      lstMember[n] = new Array();
      lstMember[n] = lstMember[i].slice(mid, lstMember[i].length);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
    }
  }
  for (i = 0; i < namMember.length; i++) {
    rec[i] = 0;
  }
  nrec = 0;
  for (i = 0; i <= namMember.length; i++) {
    equal[i] = -1;
  }
  cmp1 = lstMember.length - 2;
  cmp2 = lstMember.length - 1;
  head1 = 0;
  head2 = 0;
  numQuestion = 0;
  finishSize = 0;
  finishFlag = 0;
}

// flag: -1 (left), 0 (tie), 1 (right)
function sortList(flag) {
  saveState(); // Save the current state before sorting
  var i;
  var str;
  if (flag < 0) {
    rec[nrec] = lstMember[cmp1][head1];
    head1++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
  } else if (flag > 0) {
    rec[nrec] = lstMember[cmp2][head2];
    head2++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  } else {
    rec[nrec] = lstMember[cmp1][head1];
    head1++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
    equal[rec[nrec - 1]] = lstMember[cmp2][head2];
    rec[nrec] = lstMember[cmp2][head2];
    head2++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }
  if (head1 < lstMember[cmp1].length && head2 == lstMember[cmp2].length) {
    while (head1 < lstMember[cmp1].length) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
  } else if (
    head1 == lstMember[cmp1].length &&
    head2 < lstMember[cmp2].length
  ) {
    while (head2 < lstMember[cmp2].length) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }
  if (head1 == lstMember[cmp1].length && head2 == lstMember[cmp2].length) {
    for (i = 0; i < lstMember[cmp1].length + lstMember[cmp2].length; i++) {
      lstMember[parent[cmp1]][i] = rec[i];
    }
    lstMember.pop();
    lstMember.pop();
    cmp1 = cmp1 - 2;
    cmp2 = cmp2 - 2;
    head1 = 0;
    head2 = 0;
    if (head1 == 0 && head2 == 0) {
      for (i = 0; i < namMember.length; i++) {
        rec[i] = 0;
      }
      nrec = 0;
    }
  }
  if (cmp1 < 0) {
    str =
      "battle #" +
      (numQuestion - 1) +
      "<br>" +
      Math.floor((finishSize * 100) / totalSize) +
      "% sorted.";
    document.getElementById("battleNumber").innerHTML = str;
    showResult();
    finishFlag = 1;
  } else {
    showImage();
  }
}

function createFakeAlbum() {
  var album = {};
  var albumMetadata = {};
  var bonusTracks = [];
  for (i = 0; i < namMember.length; i++) {
    var title = namMember[lstMember[0][i]];
    var trackNum = metadata[title].trackNumber;
    if (!album[trackNum]) {
      var border =
        trackNum === 10
          ? "border-style: solid; border-width: 1px 1px 3px 1px; border-color: black;"
          : "border-style: solid; border-width: 1px; border-color: black;";
      album[trackNum] = `
        <tr>
            <td style="${border} text-align:center; padding-right:5px;">
            ${trackNum}
            </td>
            <td style="${border} padding-left:5px;">
            ${title}
            </td>
            <td style="padding:0; width:50"><img width="50" height="50" src="${metadata[title].image}"/></td>
        </tr>
        `;
      albumMetadata[trackNum] = {
        title: title,
        trackNumber: trackNum,
        album: metadata[title].album,
      };
    } else if (bonusTracks.length < 5) {
      bonusTracks.push(title);
    }
  }
  for (const [_, value] of Object.entries(albumMetadata)) {
    albumString += `${value.trackNumber}. ${value.title}\n`;
  }
  for (var i = 0; i < bonusTracks.length; i++) {
    albumString += `Bonus Track ${i + 1}: ${bonusTracks[i]}\n`;
  }
  var table = `
  <h3>Your New Personal Album</h3>
  <table style="width:450px; font-size:18px; line-height:120%; margin-left:auto; margin-right:auto; border:1px solid #000; border-collapse:collapse" align="center">
  <tr>
    <th>Track</th>
    <th>Song</th>
  </tr>
  ${album["1"]}
  ${album["2"]}
  ${album["3"]}
  ${album["4"]}
  ${album["5"]}
  ${album["6"]}
  ${album["7"]}
  ${album["8"]}
  ${album["9"]}
  ${album["10"]}
  ${bonusTracks.map((val, i) => {
    return `
      <tr>
        <td style="border:1px solid #000; text-align:center; padding-right:5px;">
            Bonus ${i + 1}
        </td>
        <td style="border:1px solid #000; padding-left:5px;">${val}</td>
        <td style="padding:0; width:50"><img width="50" height="50" src="${
          metadata[val].image
        }"/></td>
    </tr>`;
  })}
  </table>
  <button id="albumCopyText" style="margin-top: 10;" onclick="copyAlbumToClipboard()">Copy Text</button>
  `;
  document.getElementById("albumField").innerHTML = table;
}

function copyAlbumToClipboard() {
  navigator.clipboard.writeText(albumString);
  document.getElementById("albumCopyText").innerHTML = "Copied!";
  document.getElementById("albumCopyText").disabled = true;
  setTimeout(() => {
    document.getElementById("albumCopyText").innerHTML = "Copy Text";
    document.getElementById("albumCopyText").disabled = false;
  }, 2000);
}

function copyRankedSongsToClipboard() {
  navigator.clipboard.writeText(rankedSongsString);
  document.getElementById("songsCopyText").innerHTML = "Copied!";
  document.getElementById("songsCopyText").disabled = true;
  setTimeout(() => {
    document.getElementById("songsCopyText").innerHTML = "Copy Text";
    document.getElementById("songsCopyText").disabled = false;
  }, 2000);
}

function showResult() {
  createFakeAlbum();
  var ranking = 1;
  var sameRank = 1;
  var str = "";
  var i;
  str +=
    '<h3>All Songs Ranked</h3><table style="width:450px; font-size:18px; line-height:120%; margin-left:auto; margin-right:auto; border:1px solid #000; border-collapse:collapse" align="center">';
  str +=
    '<tr><td style="text-align:center;">Rank</td><td style="text-align:center;">Songs</td></tr>';
  for (i = 0; i < namMember.length; i++) {
    rankedSongsString += `${i + 1}. ${namMember[lstMember[0][i]]}\n`;
    str +=
      '<tr><td style="border:1px solid #000; text-align:center; padding-right:5px;">' +
      ranking +
      '</td><td style="border:1px solid #000; padding-left:5px;">' +
      namMember[lstMember[0][i]] +
      `</td><td style="padding:0; width:50"><img width="50" height="50" src="${
        metadata[namMember[lstMember[0][i]]].image
      }"/></td></tr>`;
    if (i < namMember.length - 1) {
      if (equal[lstMember[0][i]] == lstMember[0][i + 1]) {
        sameRank++;
      } else {
        ranking += sameRank;
        sameRank = 1;
      }
    }
  }
  str += `
  </table>
  <button id="songsCopyText" style="margin-top: 10;" onclick="copyRankedSongsToClipboard()">Copy Text</button>
  `;
  document.getElementById("resultField").innerHTML = str;
}

function showImage(undo) {
  if (!undo) numQuestion++;
  var str0 =
    "BATTLE #" +
    numQuestion +
    "<br>" +
    Math.floor((finishSize * 100) / totalSize) +
    "% SORTED";
  var str1 = "" + toNameFace(lstMember[cmp1][head1]);
  var str2 = "" + toNameFace(lstMember[cmp2][head2]);
  var img1 = metadata[str1]?.image;
  var img2 = metadata[str2]?.image;
  const innerHtml1 = `
  <div>
    ${str1}
    <br>
    <img width="50" height="50" src="${img1}"/>
  </div>
  `;
  const innerHtml2 = `
  <div>
    ${str2}
    <br>
    <img width="50" height="50" src="${img2}"/>
  </div>
  `;
  document.getElementById("battleNumber").innerHTML = str0;
  document.getElementById("leftField").innerHTML = innerHtml1;
  document.getElementById("rightField").innerHTML = innerHtml2;
}

function toNameFace(n) {
  var str = namMember[n];
  return str;
}

