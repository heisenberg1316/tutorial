import { useState } from "react";

export function CreateTodo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAddTodo = async () => {
        try {
            const response = await fetch("http://localhost:3000/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Todo created successfully!");
                setTitle("");
                setDescription("");
            }
            else {
                alert(data.message || "Something went wrong.");
            }
        }
        catch (error) {
            alert("Failed to create todo");
            console.error(error);
        }
    };

    return (
        <div>
            <input
                style={{ padding: 10, margin: 10 }}
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => {setTitle(e.target.value)}}
            />
            <br />
            <br />
            <input
                style={{ padding: 10, margin: 10 }}
                type="text"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <br />
            <button
                style={{ padding: 10, margin: 10 }}
                onClick={handleAddTodo}
            >
                Add a todo
            </button>
        </div>
    );
}
