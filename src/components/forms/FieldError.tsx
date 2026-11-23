type Props = {
    id: string
    messages?: string[]
}

export function FieldError({ id, messages }: Props) {
    if (!messages?.length) return null

    return (
        <span id={id} className="form-error mb-0 block" role="alert">
            {messages.join(" ")}
        </span>
    )
}
