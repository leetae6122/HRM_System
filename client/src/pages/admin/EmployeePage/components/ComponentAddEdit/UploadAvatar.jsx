import React, { useState } from "react";
import { Upload } from "antd";
import { toast } from "react-toastify";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const checkFile = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    toast.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    toast.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function UploadAvatar(props) {
  const { avatarUrl } = props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(avatarUrl ?? "");

  const handleChange = (info) => {
    if (!checkFile) {
      return;
    }
    setLoading(true);
    const src = URL.createObjectURL(info.file);
    setImageUrl(src);
    setLoading(false);
  };

  const UploadButton = () => (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      showUploadList={false}
      maxCount={1}
      beforeUpload={() => false}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="avatar"
          style={{
            width: "100%",
          }}
        />
      ) : (
        <UploadButton />
      )}
    </Upload>
  );
}
export default UploadAvatar;
