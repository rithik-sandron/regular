import { useState, useEffect, useRef } from "react";
import { useFetch } from "@/hooks/useFetch";
import BioCard from "@/components/BioCard";
import { convert } from "@/hooks/converter";

export default function create() {
  const { create } = useFetch();

  const drop = useRef(null);
  const drag = useRef(null);

  const [dragging, setDragging] = useState(false);
  const [username, setUsername] = useState("");
  const [bgcolor, setBgcolor] = useState("");
  const [color, setColor] = useState("");
  const [content, setContent] = useState("");
  const [contentMarkdown, setContentMarkdown] = useState("");

  const [file, setFile] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const [mfiles, setMFiles] = useState([]);
  const [mfilesUrl, setMFilesUrl] = useState([]);

  useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);
    drop.current.addEventListener("dragenter", handleDragEnter);
    drop.current.addEventListener("dragleave", handleDragLeave);
    drop.current.addEventListener("keydown", handleKeyStroke);

    return () => {
      // drop.current.removeEventListener('dragover')
      // drop.current.removeEventListener('drop')
      // drop.current.removeEventListener('dragenter')
      // drop.current.removeEventListener('dragleave')
      // drop.current.addEventListener('keydown')
    };
  }, []);

  function handleKeyStroke(e) {
    e.stopPropagation();
    if (e.which === 9) {
      e.preventDefault();

      let textarea = drop.current;

      const position = textarea.selectionStart;

      const before = textarea.value.substring(0, position);
      const after = textarea.value.substring(position, textarea.value.length);
      async function write() {
        const text = before + "    " + after;
        setContent(text);
        const md = await convert(text);
        document.getElementById("markdown-c").innerHTML = md;
        setContentMarkdown(md);

        let r = document.getElementById("drop");
        r.focus();
        r.setSelectionRange(position + 4, position + 4);
      }
      write();
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === drag.current || e.target === drop.current) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target !== drag.current || e.target !== drop.current) {
      setDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    // this is required to convert FileList object to array
    const files = [...e.dataTransfer.files];
    const count = 5;
    let p = document.getElementById("image_text");
    // check if the provided count prop is less than uploaded count of files
    if (files.length > count) {
      p.innerText = `Only ${count} file${
        count !== 1 ? "s" : ""
      } can be uploaded. Please reupload again.`;
      p.style.color = "rgba(225, 14, 14, 0.783)";

      return;
    }

    // check if some uploaded file is not in one of the allowed formats
    const formats = ["png", "jpeg", "jpg"];
    if (
      files.some(
        (file) =>
          !formats.some((format) =>
            file.name.toLowerCase().endsWith(format.toLowerCase())
          )
      )
    ) {
      p.innerText = `Only following file formats are acceptable: ${formats.join(
        ", "
      )}`;
      p.style.color = "rgba(225, 14, 14, 0.783)";
      return;
    }

    if (files && files.length) {
      onUpload(files);
    }
  };

  function onUpload(files) {
    let textarea = drop.current;
    const position = textarea.selectionStart;

    // Get the text before and after the cursor position
    const before = textarea.value.substring(0, position);
    const after = textarea.value.substring(position, textarea.value.length);
    let text = "";
    let marray = mfilesUrl;
    let length = marray.length;
    files.forEach(async (x) => {
      text += `![${x.name}](${length++})\n`;
      setFile(x);
      var reader = new FileReader();
      reader.readAsDataURL(x);
      reader.onloadend = async function () {
        setFileUrl(reader.result);
        marray.push(reader.result);
        const md = await convert(before + "\n" + text + after, marray);
        document.getElementById("markdown-c").innerHTML = md;
        setContentMarkdown(md);
      }.bind(this);
      setContent(before + "\n" + text + after);
      textarea.selectionStart = textarea.selectionEnd = position + text.length;
    });

    setMFiles(files);
    setMFilesUrl(marray);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("file", file);
    formData.append("bgcolor", bgcolor);
    formData.append("color", color);
    formData.append("content", content);
    create({
      url: "/u/create",
      setErrors: setErrors,
      formData: formData,
    });
    setIsLoading(false);
  }

  async function handleChange(event, field) {
    event.preventDefault();
    if (field === "bgcolor") setBgcolor(event.target.value);
    if (field === "color") setColor(event.target.value);
    if (field === "username") setUsername(event.target.value);
    if (field === "file") setFile(event.target.files[0]);
    if (field === "content") {
      if (event.target.value !== null) {
        if (event.target.value === "") {
          setContent("");
          document.getElementById("markdown-c").innerHTML = "";
          setContentMarkdown("");
        } else {
          setContent(event.target.value);
          const md = await convert(event.target.value, mfilesUrl);
          document.getElementById("markdown-c").innerHTML = md;
          setContentMarkdown(md);
        }
      }
    }
  }

  return (
    <div className="layout-form">
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <textarea
          id="drop"
          className="markdwown"
          ref={drop}
          type="text"
          name="content"
          required
          autoComplete="content"
          placeholder="Content"
          value={content}
          onChange={(e) => handleChange(e, "content")}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Save"}
        </button>
      </form>

      {(username || fileUrl || content || bgcolor || color) && (
        <BioCard
          user={{
            _id: "c",
            username,
            fileUrl,
            content,
            bgcolor,
            color,
            isLink: false,
            contentMarkdown,
            mfilesUrl,
          }}
        />
      )}
    </div>
  );
}
