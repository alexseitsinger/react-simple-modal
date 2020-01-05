/** @jsx jsx */
import styled from "@emotion/styled"

export interface ContainerProps {
  zIndex?: number;
}

export const Container = styled("div")(
  {
    position: "absolute",
    minHeight: "100%",
    width: "100%",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  (props: ContainerProps) => ({
    ...(props.zIndex
      ? {
          zIndex: props.zIndex,
        }
      : {}),
  })
)

export interface BackgroundProps {
  backgroundShade?: string;
}

export const Background = styled("div")(
  {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    minHeight: "100%",
    zIndex: 3,
  },
  (props: BackgroundProps) => {
    switch (props.backgroundShade) {
      case "dark": {
        return {
          backgroundColor: "rgba(22, 22, 22, 0.5)",
        }
      }
      case "darker": {
        return {
          backgroundColor: "rgba(22, 22, 22, 0.7)",
        }
      }
      case "darkest": {
        return {
          backgroundColor: "rgba(22, 22, 22, 0.9)",
        }
      }
      case "light": {
        return {
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }
      }
      case "lighter": {
        return {
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }
      }
      case "lightest": {
        return {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }
      }
    }
  }
)

export const Foreground = styled.div`
  z-index: 4;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const Content = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 5;
`

export interface ButtonProps {
  position?: string;
  shade?: string;
}

export const Button = styled("button")(
  {
    top: 0,
    right: 0,
    zIndex: 2,
  },
  (props: ButtonProps) => {
    if (props.position === "foreground") {
      if (props.shade === "dark") {
        return {
          position: "fixed",
          color: "#EEEEEE",
        }
      }
      if (props.shade === "light") {
        return {
          position: "fixed",
          color: "#222222",
        }
      }
    }
    if (props.position === "window") {
      if (props.shade === "dark") {
        return {
          position: "absolute",
          color: "#222222",
        }
      }
      if (props.shade === "light") {
        return {
          position: "absolute",
          color: "#EEEEEE",
        }
      }
    }
  }
)
