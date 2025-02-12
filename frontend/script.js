async function uploadFile() {
  const subject = document.getElementById("subject").value;
  const assignmentNumber = document.getElementById("assignment-number").value;
  const fileInput = document.getElementById("file-input").files[0];

  if (!subject || !assignmentNumber || !fileInput) {
    alert("Please fill in all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("subject", subject);
  formData.append("assignment_number", assignmentNumber);
  formData.append("file", fileInput);

  const response = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  alert(result.message || result.error);
}

async function sendMessage() {
  const input = document.getElementById("chat-input").value.toLowerCase();
  const chatWindow = document.getElementById("chat-window");

  // Extract subject and assignment number
  const subject = input.split(" ")[0]; // e.g., "dsbda assignment 5"
  const assignmentNumber = input.split(" ")[2];

  if (!subject || !assignmentNumber) {
    chatWindow.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
    chatWindow.innerHTML += `<p><strong>Bot:</strong> Please specify subject and assignment number (e.g., DSBDA Assignment 5).</p>`;
    return;
  }

  const response = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, assignment_number: assignmentNumber }),
  });

  const result = await response.json();
  if (result.file_path) {
    chatWindow.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
    chatWindow.innerHTML += `<p><strong>Bot:</strong> <a href="${result.file_path}" target="_blank">Download Assignment ${assignmentNumber}</a></p>`;
  } else {
    chatWindow.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
    chatWindow.innerHTML += `<p><strong>Bot:</strong> Assignment not found.</p>`;
  }
}