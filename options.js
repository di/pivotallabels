function textColor(hex) {
  let r = parseInt(hex.slice(1,3), 16)
  let g = parseInt(hex.slice(3,5), 16)
  let b = parseInt(hex.slice(5,7), 16)
  let a = Math.pow((Math.pow(0.299*r, 2) + Math.pow(0.587*g, 2) + Math.pow(0.114*b, 2)), 0.5)
  if (a < 128) {
    return "#FFFFFF"
  } else {
    return "#000000"
  }
}

function setColor(hex) {
  document.getElementById('labelColor').value = hex.substring(1, 7);
}

function empty(obj) {
  return Object.getOwnPropertyNames(obj).length == 0
}

function set_status(message) {
  var status = document.getElementById('status');
  status.textContent = message;
  setTimeout(function() {
    status.textContent = '';
  }, 750);
}

function delete_label(labelName) {
  chrome.storage.sync.get({'labels': {}}, function(storage) {
    delete storage.labels[labelName]
    chrome.storage.sync.set(storage, function() {
      update_labels(storage)
    });
  });
}

function update_labels(storage) {
  if (!empty(storage.labels)) {
    document.getElementById('labelHeader').className = '';
    document.getElementById('labelDescription').className = '';
  } else {
    document.getElementById('labelHeader').className = 'hidden';
    document.getElementById('labelDescription').className = 'hidden';
  }

  let labelDiv = document.getElementById('labels');
  labelDiv.innerText = ''
  for (let key in storage.labels) {
    let label = document.createElement("a")
    label.appendChild(document.createTextNode(key));
    label.className = 'label custom'
    let hex = '#' + storage.labels[key]
    label.style.backgroundColor = hex
    label.style.color = textColor(hex)
    let del = document.createElement("a");
    del.appendChild(document.createTextNode("Delete"))
    del.href = "#"
    del.onclick = () => delete_label(key)
    let div = document.createElement("div");
    div.className = 'preview'
    div.appendChild(label);
    div.appendChild(del);
    labelDiv.appendChild(div);
  }
}

// Saves options to chrome.storage
function save_options() {
  var labelName = document.getElementById('labelName').value.toLowerCase();
  var labelColor = document.getElementById('labelColor').value;
  chrome.storage.sync.get({'labels': {}}, function(storage) {
    if (labelName && labelColor) {
      storage.labels[labelName] = labelColor
      chrome.storage.sync.set(storage, function() {
        document.getElementById('labelName').value = '';
        document.getElementById('labelColor').value = '';
        update_labels(storage);
      });
    } else {
      set_status('Missing fields!')
    }
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({'labels': {}}, update_labels);
  var palette = document.getElementById('palette')
  var colors = [
    "#e7e7e7", "#b6cff5", "#98d7e4", "#e3d7ff", "#fbd3e0", "#f2b2a8",
    "#c2c2c2", "#4986e7", "#2da2bb", "#b99aff", "#f691b2", "#fb4c2f",
    "#ffc8af", "#ffdeb5", "#fbe983", "#fdedc1", "#b3efd3", "#a2dcc1",
    "#ff7537", "#ffad46", "#cca6ac", "#ebdbde", "#42d692", "#16a765",
  ]
  colors.forEach(function(hex) {
    let color = document.createElement("div");
    color.className = 'color';
    color.style.backgroundColor = hex
    color.style.color = textColor(hex)
    color.textContent = 'a'
    color.onclick = () => setColor(hex);
    palette.appendChild(color);
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
