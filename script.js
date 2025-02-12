const backendUrl = "https://rajgpt.onrender.com"; 

// Upload Form Submission
document.getElementById("upload-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
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

    try {
        const response = await fetch(`${backendUrl}/upload`, { 
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        document.getElementById("upload-status").textContent = result.message || result.error;
    } catch (error) {
        console.error("Error:", error);
    }
});

// Chat Form Submission
document.getElementById("chat-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-input").value.toLowerCase();
    const chatWindow = document.getElementById("chat-window");

    // Extract subject and assignment number
    const subject = input.split(" ")[0]; 
    const assignmentNumber = input.split(" ")[2];

    if (!subject || !assignmentNumber) {
        chatWindow.innerHTML += `<div class="message bot-message">Please specify subject and assignment number (e.g., DSBDA Assignment 5).</div>`;
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/search`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject, assignment_number: assignmentNumber }),
        });
        const result = await response.json();

        if (result.file_path) {
            chatWindow.innerHTML += `<div class="message bot-message"><a href="${backendUrl}/files/${result.file_path.split('/').pop()}" target="_blank">Download Assignment ${assignmentNumber}</a></div>`;
        } else {
            chatWindow.innerHTML += `<div class="message bot-message">Assignment not found.</div>`;
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
