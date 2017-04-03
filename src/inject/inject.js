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

chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(handleMutationEvents);
      });

      // configuration of the observer:
      var config = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
      };

      observer.observe(document, config);

      var handleMutationEvents = function handleMutationEvents(mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, styleLabelsInNode);
        styleLabelsInNode(mutation.target);
      }

      var styleLabelsInNode = function styleLabelsInNode(node) {
        if (nodeIsElement(node)) {
          styleLabels(findLabelsInNode(node));
        }
      }

      var nodeIsElement = function nodeIsElement(node) {
        return (typeof node.querySelectorAll !== 'undefined');
      }

      var findLabelsInNode = function findLabelsInNode(node) {
        return node.querySelectorAll('a.label');
      }

      var styleLabels = function styleLabels(labels) {
        chrome.storage.sync.get({'labels': {}}, function(storage) {
          Array.prototype.forEach.call(labels, function(label) {
            var labelText = label.textContent.replace(/\, $/g, '');
            var labelColor = storage.labels[labelText];
            if (labelColor) {
              var hex = "#" + labelColor
              label.style.setProperty('background-color', hex);
              label.style.setProperty('color', textColor(hex));
              label.textContent = labelText;
              label.classList.add('custom')
            } else {
              label.style.backgroundColor = '';
              label.classList.remove('custom')
            }
          });
        });
      }
    }
  }, 10);
});
