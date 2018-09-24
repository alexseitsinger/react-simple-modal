import React from "react"
import PropTypes from "prop-types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTimes} from "@fortawesome/free-solid-svg-icons"
import {
    Modal,
    ModalForeground,
    ModalBackground,
    ModalCloseButton,
    ModalWindow,
    ModalWindowContent,
} from "./elements"

class SimpleModalActual extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]).isRequired,
        onDidMount: PropTypes.func.isRequired,
        onWillUnmount: PropTypes.func.isRequired,
        backgroundShade: PropTypes.string.isRequired,
        closeButtonStyle: PropTypes.object.isRequired,
        onClickCloseButton: PropTypes.func.isRequired
    }
    constructor(props){
        super(props)
        this.MODAL = null
    }
    componentDidMount() {
        this.props.onDidMount(this.MODAL)
    }
    componentWillUnmount() {
        this.props.onWillUnmount(this.MODAL)
    }
    render() {
        const {
            children,
            backgroundShade,
            closeButtonStyle,
            onClickCloseButton
        } = this.props
        return (
            <Modal
                className={"modal"}
                innerRef={(el) => {
                    this.MODAL = el
                }}>
                <ModalBackground
                    backgroundShade={backgroundShade}/>
                <ModalForeground>
                    <ModalCloseButton
                        backgroundShade={backgroundShade}
                        style={closeButtonStyle}
                        onClick={onClickCloseButton}>
                        <FontAwesomeIcon
                            icon={faTimes}
                            size={"2x"}/>
                    </ModalCloseButton>
                    <ModalWindow>
                        <ModalWindowContent>
                            {children}
                        </ModalWindowContent>
                    </ModalWindow>
                </ModalForeground>
            </Modal>
        )
    }
}

export default SimpleModalActual