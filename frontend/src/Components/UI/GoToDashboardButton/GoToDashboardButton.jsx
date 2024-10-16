import { TinyColor } from "@ctrl/tinycolor";
import { Button, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";

const GoToDashboardButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate("/dashboard");

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
      <Button onClick={() => handleClick()} type="primary" size="large">
        Go To Dashboard
      </Button>
    </ConfigProvider>
  );
};

export default GoToDashboardButton;
