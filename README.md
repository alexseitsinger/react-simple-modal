# Simple Modal

## Description

A simple modal.

## Installation

```
npm install @alexseitsinger/simple-modal
```

or

```
yarn add @alexseitsinger/simple-modal
```

## Props

* backgroundShade - (String, Optional) - The shade of color (dark/light) to use for the modal background.
* closeButtonStyle - (Object, Optional) - Extra style to apply to the close button.
* onClose - (Function, Required) - Function to run when the modal is closed.
* onOpen - (Function, Optional) - Function to invoke when the modal is opened.
* isVisible - (Boolean, Required) - Is this modal visible or not?
* onEscapeKey - (Function, Optional) - Function to run when escape key is pressed.

## Usage

```javascript
import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import SimpleModal from "@alexseitsinger/simple-modal"
import {setModalVisible} from "../actions/example"
import style from "./style.css"

class ExampleApp extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        modalVisible: PropTypes.bool.isRequired
    }
    render() {
        const {
            dispatch,
            modalVisible
        } = this.props
        return (
            <div className={style.container}>
                <button className={style.openModalButton}
                        onClick={() => {
                            dispatch(setModalVisible(true))
                        }}>
                    Open Modal
                </button>
                <SimpleModal isVisible={modalVisible}
                             backgroundShade={"dark"}
                             onOpen={() => {
                                // Do something fun here.
                             }}
                             onClose={() => {
                                dispatch(setModalVisible(false))
                             }}
                             onEscapeKey={() => {
                                dispatch(setModalVisible(false))
                             }}
                             closeButtonStyle={{
                                backgroundColor: "#FFEE00",
                                color: "#FFFFFF",
                             }}>
                    <div>This is in the modal window</div>
                </SimpleModal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        modalVisible: state.example.modalVisible,
    }
}

export default connect(mapStateToProps)(ExampleApp)
export {ExampleApp as ExampleAppNotConnected}
```