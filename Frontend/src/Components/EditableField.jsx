import { useEffect,useRef,useState } from "react";

export function EditableField({label,value,onSave,type = "text",placeholder,validate,})
{
    const [editing,setEditing] = useState(false);
    const [draft,setDraft] = useState(value ?? "");
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setDraft(value ?? "");
    }, [value]);

    useEffect(() => {
        if(editing) inputRef.current?.focus();
    },[editing]);

    function startEdit(){
        setDraft(value ?? "");
        setError(null);
        setEditing(true);
    }

    function cancel() {
        setDraft(value ?? "");
        setError(null);
        setEditing(false);
    }

    async function save() {
        setError(null);
        
        const newValue = draft.trim();

        if(newValue === (value ?? "")){
            setEditing(false);
            return;
        }

        if(validate) {
            const msg = validate(newValue);
            if (msg) {
                setError(msg);
                return;
            }
        }

        setLoading(true);
        try{
            await onSave(newValue);
            setEditing(false);
        }
        catch (err) {
            setError(err.message || "Error");
        }
        finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e){
        if (e.key === "Enter") {
            e.preventDefault();
            save();
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
        }
    }

    return (
        <div className="editable-field">
            <span className="editable-label">{label}</span>

            {editing ? (
                <div className="editable-edit">
                    <input
                        ref={inputRef}
                        type={type}
                        value={draft}
                        placeholder={placeholder}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={save}
                        disabled={loading}
                        title="Valider"
                    >
                        ✓
                    </button>
                    <button
                        type="button"
                        onClick={cancel}
                        disabled={loading}
                        title="Annuler"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div className="editable-view">
                    <span className="editable-value">
                        {value || <em>Non défini</em>}
                    </span>
                    <button
                        type="button"
                        onClick={startEdit}
                        title="Modifier"
                    >
                        ✏️
                    </button>
                </div>
            )}

            {error && <p className="editable-error">{error}</p>}
        </div>
    );
}