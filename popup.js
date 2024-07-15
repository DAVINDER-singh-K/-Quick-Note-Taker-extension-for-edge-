document.addEventListener('DOMContentLoaded', function() {
  var notepad = document.getElementById('notepad');
  var saveBtn = document.getElementById('saveBtn');
  var clearBtn = document.getElementById('clearBtn');

  // Load saved note when popup opens
  chrome.storage.sync.get('quickNote', function(data) {
    if (data.quickNote) {
      notepad.value = data.quickNote;
    }
  });

  // Save note
  saveBtn.addEventListener('click', function() {
    var note = notepad.value;
    chrome.storage.sync.set({quickNote: note}, function() {
      console.log('Note saved');
      // Provide visual feedback
      saveBtn.textContent = 'Saved!';
      setTimeout(function() {
        saveBtn.textContent = 'Save Note';
      }, 1000);
    });
  });

  // Clear note
  clearBtn.addEventListener('click', function() {
    notepad.value = '';
    chrome.storage.sync.remove('quickNote', function() {
      console.log('Note cleared');
      // Provide visual feedback
      clearBtn.textContent = 'Cleared!';
      setTimeout(function() {
        clearBtn.textContent = 'Clear Note';
      }, 1000);
    });
  });
});