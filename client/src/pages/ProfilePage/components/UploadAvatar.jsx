import React, { useState } from "react";
import { message, Skeleton, Upload } from "antd";
import defaultAvatar from "assets/images/avatar-user.jpg";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function UploadAvatar(props) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(props.url);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <>
      <Upload.Dragger
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        showUploadList={false}
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {loading ? (
          <Skeleton.Image
            active
            loading={loading}
            style={{
              width: 200,
              height: 200,
            }}
          />
        ) : (
          <img
            src={imageUrl ? imageUrl : defaultAvatar}
            alt="avatar"
            style={{
              width: "100%",
              border: "1px solid #a1a1a1",
              borderRadius: 5
            }}
          />
        )}
      </Upload.Dragger>
    </>
  );
}
export default UploadAvatar;
