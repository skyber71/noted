export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
        <nav class="navbar">
            <h2>NoteD</h2>
        </nav>
        <div class="content">
            <div class="notes__sidebar">
                <button class="notes__add" type="button">+ Add Note</button>
                <p id="count"></p>
                <div class="notes__list">
                    <div class="notes__list-item notes__list-item--selected">
                        <div class="notes_small_title_delete">
                            <div class="notes__small-title">Lecture Notes</div>
                            <i class="fa-solid fa-copy"></i>
                            <i class="fa-solid fa-trash notes_delete"></i>
                        </div>
                        <div class="notes__small-body">I learnt nothing today.</div>
                        <div class="notes__small-updated">Thursday 3:30pm</div>
                    </div>
                </div>
                <div class="empty" id="empty">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>Nothing to show :(</p>
                </div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="Enter a title...">
                <textarea class="notes__body">I am the notes body...</textarea>
                <button class="save-btn">Save</button>
            </div>
        </div>
        



        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");
        const savBtn = this.root.querySelector(".save-btn");
        
        

        

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        savBtn.addEventListener("click",()=>{
            const updatedTitle = inpTitle.value.trim();
            const updatedBody = inpBody.value.trim();
            this.onNoteEdit(updatedTitle, updatedBody);

        })

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;
        const MAX_TITLE_LENGTH = 20;
        if(title.length === 0){
            title = "Empty note...";
            if(body.length === 0){
                this.onNoteDelete(id);
                location.reload();
            }
        }
        

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes_small_title_delete">
                        <div class="notes__small-title">
                        ${title.substring(0, MAX_TITLE_LENGTH)}${title.length > MAX_TITLE_LENGTH ? "..." : ""}

                        </div>
                        <i class="fa-solid fa-trash notes_delete"></i>
                    </div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
            
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }


        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });
        });

        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.querySelectorAll(".notes_delete").forEach(notesDelete =>{
                notesDelete.addEventListener("click", ()=>{
                    const doDelete = confirm("Are you sure you want to delete this note?");
                    if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                    }
                }
                )
            });
        });

        


    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
