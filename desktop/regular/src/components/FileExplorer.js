import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import TopComponent from "./TopComponent";

const FileExplorer = ({ component, setComponent }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        invoke("get_files").then(data => setFiles(data));
    }, []);

    return (
        <div className="file-explorer">
            <div className="view-changer">
                <h3>Files</h3>
                <TopComponent setComponent={setComponent} component={component}/>
            </div>
            {files.map(file => {
                return (
                    <div>
                        {file}
                    </div>
                );
            })}
        </div>
    );
};

export default FileExplorer;
