import { useState, type RefObject } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Button } from 'primereact/button'
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber'

type Props = {
    opRef: RefObject<OverlayPanel>
    totalItems: number
    onCustomSelection: (num: number) => Promise<void>
}

export default function CustomSelectionPanel({ opRef, totalItems, onCustomSelection }: Props) {
    const [numInput, setNumInput] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSelect = async () => {
        if (!numInput) return

        setIsLoading(true)
        opRef.current?.hide()

        try {
            await onCustomSelection(numInput)
        } catch (_) {
        } finally {
            setIsLoading(false)
            setNumInput(null)
        }
    }

    return (
        <OverlayPanel ref={opRef} id="overlay_panel">
            <div
                style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 8 }}
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter' && numInput && !isLoading) {
                        handleSelect()
                    }
                }}
            >
                <label htmlFor="qty-input">Select top N rows</label>
                <InputNumber
                    inputId="qty-input"
                    value={numInput}
                    onValueChange={(e: InputNumberValueChangeEvent) => setNumInput(e.value ?? null)}
                    placeholder="Try something like 20"
                    min={1}
                    max={totalItems}
                />
                <div style={{ pointerEvents: 'auto' }}>
                    <Button
                        label="Select"
                        onClick={handleSelect}
                        disabled={!numInput || isLoading}
                        loading={isLoading}
                    />
                </div>
            </div>
        </OverlayPanel>
    )
}
