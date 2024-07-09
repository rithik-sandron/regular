import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import TopComponent from "./TopComponent";
import { convertDate } from "../lib/generalUtility";

const FileExplorer = ({ component, setComponent, setFileId, fileId }) => {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        invoke("get_files").then(data => {
            setFiles(data);
        })
    }, []);

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
                <TopComponent setComponent={setComponent} component={component} />
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
