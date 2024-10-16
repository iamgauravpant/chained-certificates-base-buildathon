import { TinyColor } from "@ctrl/tinycolor";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, ConfigProvider } from "antd";
import { setPlaylistPortUserCookie } from "../../../utils/cookieUtils";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../../../redux/actions/user";
import { openNotificationWithIcon } from "../../../utils/openNotificationWithIcon";

const SignInWithGoogleButton = () => {
  const dispatch = useDispatch();
  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setPlaylistPortUserCookie(tokenResponse);
        dispatch(getUserInfo({ access_token: tokenResponse.access_token }));
      } catch (error) {
        openNotificationWithIcon("error", error.message);
        console.log("error :", error.message);
      }
    },
  });

  const colors1 = ["#1bd760", "#ff0000"];
  const getHoverColors = (colors) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
  const getActiveColors = (colors) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: `linear-gradient(135deg, ${colors1.join(", ")})`,
            colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(
              colors1
            ).join(", ")})`,
            colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(
              colors1
            ).join(", ")})`,
            lineWidth: 0,
          },
        },
      }}
    >
      <Button onClick={() => handleLogin()} type="primary" size="large">
        Sign In With Google
      </Button>
    </ConfigProvider>
  );
};

export default SignInWithGoogleButton;
