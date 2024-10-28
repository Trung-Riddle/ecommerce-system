import { useState, useCallback } from 'react';

interface UseFileInputProps {
  maxSizeMB?: number; // Giới hạn kích thước file (MB)
  maxFiles?: number; // Giới hạn số lượng file
}

interface UseFileInputResult {
  files: File[]; // Danh sách file đã chọn
  linkImages: string[]; // Danh sách URL để preview ảnh
  isValid: boolean; // Kiểm tra xem có file nào hợp lệ không
  errors: string[]; // Danh sách lỗi
  handleFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Hàm xử lý khi thay đổi input
  removeFile: (index: number) => void; // Hàm xóa file theo index
  clear: () => void; // Hàm xóa tất cả các file
}

const useFileInput = ({
  maxSizeMB = 2,
  maxFiles = 5
}: UseFileInputProps = {}): UseFileInputResult => {
  const [files, setFiles] = useState<File[]>([]);
  const [linkImages, setLinkImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const isValid = files.length > 0 && errors.length === 0;

  const handleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles: File[] = [];
    const newErrors: string[] = [];

    // Kiểm tra số lượng file
    if (selectedFiles.length > maxFiles) {
      newErrors.push(`Bạn chỉ có thể chọn tối đa ${maxFiles} file.`);
    } else {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Kiểm tra kích thước file
        if (file.size / 1024 / 1024 > maxSizeMB) {
          newErrors.push(`File "${file.name}" vượt quá giới hạn kích thước ${maxSizeMB}MB.`);
        } else {
          newFiles.push(file);
        }
      }
    }

    setFiles(newFiles);
    setErrors(newErrors);

    // Tạo link ảnh preview
    const newLinkImages = newFiles.map((file) => URL.createObjectURL(file));
    setLinkImages(newLinkImages);
  }, [maxFiles, maxSizeMB]);

  const removeFile = useCallback((index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setLinkImages((prevLinkImages) => prevLinkImages.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => {
    setFiles([]);
    setLinkImages([]);
    setErrors([]);
  }, []);

  return {
    files,
    linkImages,
    isValid,
    errors,
    handleFilesChange,
    removeFile,
    clear
  };
};

export default useFileInput;
