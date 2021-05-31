import Toast from "react-native-root-toast";
import { Colors } from "../constants/colors/Colors";

export function Toaster(
  toastMessage,
  bgColor,
  textColor = Colors.WHITE_COLOR,
  position = Toast.positions.BOTTOM
) {
  return Toast.show(toastMessage, {
    duration: Toast.durations.SHORT,
    animation: true,
    containerStyle: {
      backgroundColor: bgColor,
      width: "80%",
      marginBottom: 25,
    },
    textStyle: {
      fontSize: 16,
      color: textColor,
    },
    position: position,
  });
}
