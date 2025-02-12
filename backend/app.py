from flask import Flask, request, jsonify, send_from_directory
import os
import sqlite3

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect("assignments.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            assignment_number TEXT NOT NULL,
            file_path TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.route("/upload", methods=["POST"])
def upload():
    subject = request.form.get("subject")
    assignment_number = request.form.get("assignment_number")
    file = request.files.get("file")

    if not (subject and assignment_number and file):
        return jsonify({"error": "Missing data"}), 400

    # Save the file
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)

    # Save to database
    conn = sqlite3.connect("assignments.db")
    c = conn.cursor()
    c.execute("""
        INSERT INTO assignments (subject, assignment_number, file_path)
        VALUES (?, ?, ?)
    """, (subject, assignment_number, file_path))
    conn.commit()
    conn.close()

    return jsonify({"message": "File uploaded successfully!"})

@app.route("/search", methods=["POST"])
def search():
    subject = request.form.get("subject")
    assignment_number = request.form.get("assignment_number")

    if not (subject and assignment_number):
        return jsonify({"error": "Missing data"}), 400

    # Search in database
    conn = sqlite3.connect("assignments.db")
    c = conn.cursor()
    c.execute("""
        SELECT file_path FROM assignments
        WHERE subject = ? AND assignment_number = ?
    """, (subject, assignment_number))
    result = c.fetchone()
    conn.close()

    if result:
        return jsonify({"file_path": result[0]})
    else:
        return jsonify({"error": "Assignment not found"}), 404

@app.route("/files/<filename>")
def get_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ == "__main__":
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)