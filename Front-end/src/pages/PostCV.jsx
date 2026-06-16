import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const API_BASE = import.meta.env.VITE_API_URL || '';
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud,
    FileText,
    X,
    CheckCircle,
    ShieldCheck,
    Users,
    SearchCheck,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function PostCV({ user, token }) {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploaded, setUploaded] = useState(false);

    const validateFile = (selectedFile) => {
        if (!selectedFile) {
            throw new Error("Please select a CV file.");
        }

        if (!allowedTypes.includes(selectedFile.type)) {
            throw new Error(
                "Only PDF, DOC and DOCX files are allowed."
            );
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            throw new Error(
                "File size must not exceed 5 MB."
            );
        }

        return true;
    };

    const onDrop = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];

        try {
            validateFile(selectedFile);
            setFile(selectedFile);
            setError("");
        } catch (err) {
            setFile(null);
            setError(err.message);
        }
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
        },
    });

    const removeFile = () => {
        setFile(null);
        setError("");
        setProgress(0);
    };
    const handleUpload = async () => {
        try {
            // ✅ check missing file first
            if (!file) {
                throw new Error("Please select a CV file before uploading.");
            }

            validateFile(file);

            setUploading(true);
            setError(""); // clear previous errors
            setProgress(0);

            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 95) return prev;
                    return prev + 5;
                });
            }, 100);

            const formData = new FormData();
            formData.append("cv", file);

            const response = await fetch(`${API_BASE}/api/upload-cv`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Upload failed.');
            }

            clearInterval(interval);
            setProgress(100);
            setUploaded(true);

        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (uploaded) {
        return (
            <div className="cv-page">
                <motion.div
                    className="success-card"
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                >
                    <div className="success-icon">
                        <CheckCircle size={70} />
                    </div>

                    <h2>Resume Uploaded Successfully</h2>

                    <p>
                        Your profile is now visible to
                        recruiters and employers looking
                        for qualified candidates.
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                user
                                    ? "/dashboard"
                                    : "/"
                            )
                        }
                    >
                        Continue
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="cv-page">
            <motion.div
                className="upload-card"
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
            >
                <div className="upload-header">
                    <div className="hero-icon">
                        <UploadCloud size={38} />
                    </div>

                    <h1>Upload Your Resume</h1>

                    <p className="subtitle">
                        Get discovered by recruiters,
                        apply faster, and unlock more
                        opportunities.
                    </p>
                </div>

                {!user && (
                    <div className="notice">
                        Upload as a guest or sign in to
                        save your resume permanently.
                    </div>
                )}

                <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive
                        ? "active"
                        : ""
                        }`}
                >
                    <input
                        {...getInputProps()}
                    />

                    <UploadCloud size={52} />

                    <h3>
                        {isDragActive
                            ? "Drop your resume here"
                            : "Drag & Drop Your Resume"}
                    </h3>

                    <p>
                        Or click to browse your
                        files
                    </p>

                    <div className="file-types">
                        <span>PDF</span>
                        <span>DOC</span>
                        <span>DOCX</span>
                    </div>

                    <small>
                        Maximum file size: 5 MB
                    </small>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="error"
                            initial={{
                                opacity: 0,
                                y: -5,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {file && (
                    <motion.div
                        className="file-card"
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                    >
                        <div className="file-icon">
                            <FileText size={26} />
                        </div>

                        <div className="file-info">
                            <h4>{file.name}</h4>

                            <span>
                                {(
                                    file.size /
                                    1024 /
                                    1024
                                ).toFixed(2)}
                                MB
                            </span>
                        </div>

                        <button
                            className="remove-btn"
                            onClick={
                                removeFile
                            }
                            disabled={
                                uploading
                            }
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                )}

                {uploading && (
                    <div className="progress-wrapper">
                        <div className="progress-header">
                            <span>
                                Uploading...
                            </span>

                            <span>
                                {progress}%
                            </span>
                        </div>

                        <div className="progress-bar">
                            <motion.div
                                className="progress-fill"
                                animate={{
                                    width: `${progress}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="benefit-grid">
                    <div className="benefit-card">
                        <ShieldCheck
                            size={20}
                        />
                        <span>
                            Secure Upload
                        </span>
                    </div>

                    <div className="benefit-card">
                        <SearchCheck
                            size={20}
                        />
                        <span>
                            ATS Friendly
                        </span>
                    </div>

                    <div className="benefit-card">
                        <Users size={20} />
                        <span>
                            Recruiter Access
                        </span>
                    </div>
                </div>

                <div className="actions">
                    <button
                        className="primary-btn"
                        disabled={
                            !file ||
                            uploading
                        }
                        onClick={
                            handleUpload
                        }
                    >
                        {uploading
                            ? "Uploading..."
                            : "Upload Resume"}
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            navigate(
                                user
                                    ? "/dashboard"
                                    : "/"
                            )
                        }
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
}