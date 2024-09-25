import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { convertDate } from "../lib/generalUtility";

const FileExplorer = ({ component, setComponent, setFileId, fileId }) => {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        invoke("get_files").then(data => {
            setFiles(data);
        })
    }, []);

    function handleCreate() {
        invoke("create_doc").then(() => {
            invoke("get_files").then(data => {
                setFiles(data);
            })
        })
    }

    function handlleFileClick(e, id) {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById(`file-exp-list-${fileId}`).classList.remove('file-active');
        setFileId(id);
        document.getElementById(`file-exp-list-${id}`).classList.add('file-active');
    }

    return (
        <div className="file-explorer">
            <span className="view-changer">
                <h3>Files</h3>
                <div className="view-changer">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
                    <span className="file-add material-symbols-outlined" onClick={handleCreate}>add_circle</span>
                </div>

            </span>
            {files.map(file => {
                return (
                    <div
                        id={`file-exp-list-${file.id}`}
                        key={file.id}
                        onClick={(e) => handlleFileClick(e, file.id)}
                        className={file.id === fileId ? 'file-active' : ""}>
                        <h3>{file.name}</h3>
                        <time>{convertDate(file.modified_date)}</time>
                    </div>
                );
            })}
        </div>
    );
};

export default FileExplorer;
