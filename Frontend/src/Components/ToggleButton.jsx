//TODO c un exemple de la page react officielle A SUPPRIMER!
//En + la func stylesheet c'est style android

import { spring } from "motion"
import { AnimateView } from "motion/react-animate-view"
import { startTransition, useState } from "react"

/**
 * Title: AnimateView: Toggle
 */

export default function ToggleButton({
        onClick,
        selected = false,
        disabled = false,
    }) {

    // Use controlled component approach - if 'selected' is passed, use it as the source of truth
    const [isOn, setIsOn] = useState(selected)

    // Update local state when prop changes (for cases where parent controls it)
    // This handles the case where parent might change the selected prop
    const handleToggle = () => {
        if (disabled) return;
        
        const newIsOn = !isOn;
        setIsOn(newIsOn);
        
        // Call parent's onClick handler if provided
        if (onClick) {
            onClick(newIsOn);
        }
    }

    return (
        <div className="toggle-example">
            <AnimateView
                transition={{
                    type: spring,
                    visualDuration: 0.2,
                    bounce: 0.2,
                }}
            >
                <button
                    className="toggle-container"
                    style={{
                        justifyContent: isOn ? "flex-end" : "flex-start",
                        backgroundColor: isOn
                            ? "var(--hue-6)"
                            : "rgba(255, 255, 255, 0.15)",
                    }}

                    onClick={handleToggle}
                    disabled={disabled}
                >
                    <Handle />
                </button>
            </AnimateView>
            <StyleSheet />
        </div>
    )
}

function Handle() {
    return (
        <AnimateView
            transition={{
                type: spring,
                visualDuration: 0.2,
                bounce: 0.2,
            }}
        >
            <div className="toggle-handle" />
        </AnimateView>
    )
}

/** ==============   Styles   ================ */

function StyleSheet() {
    return (
        <style>{`
            .toggle-example {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
            }

            .toggle-container {
                width: 100px;
                height: 50px;
                border-radius: 50px;
                cursor: pointer;
                display: flex;
                padding: 10px;
                border: none;
                transition: background-color 0.2s ease;
            }

            .toggle-handle {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: white;
            }
        `}</style>
    )
}
