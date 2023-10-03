import { useState } from "react";
import { Upload } from "antd";
import defaultAvatar from "assets/images/avatar-user.jpg";
import employeeApi from "api/employeeApi";
import { toast } from "react-toastify";
import userApi from "api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { login } from "reducers/auth";
import { LoadingOutlined } from "@ant-design/icons";

function UploadAvatar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

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

  const beforeUpload = async (file) => {
    if (!checkFile(file)) {
      return true;
    }
    try {
      setLoading(true);
      await employeeApi.updateAvatar(file);
      const data = (await userApi.getUserProfile()).data;
      dispatch(login(data));
      setLoading(false);
    } catch (error) {
      toast.error(error);
    }
    return false;
  };

  const uploadButton = (
    <div>
      <LoadingOutlined />
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
    <>
      <Upload.Dragger
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        fileList={[]}
        beforeUpload={beforeUpload}
        style={{ width: "100%" }}
      >
        {!loading ? (
          <img
            src={user?.profile.avatarUrl ?? defaultAvatar}
            alt="avatar"
            style={{
              width: "100%",
              border: "1px solid #a1a1a1",
              borderRadius: 5,
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload.Dragger>
    </>
  );
}
export default UploadAvatar;
