import { useState, FormEvent } from 'react';

import s from './todo-card-footer.module.sass';

interface ITodoCardFooter {
    cardIndex: number;
    addNewTodoItem: (textareaContent: string, cardIndex: number) => void
}

export const TodoCardFooter = ({ cardIndex,  addNewTodoItem }: ITodoCardFooter) => {
    const [textareaContent, setTextareaContent] = useState<string>('');

    const submitAddTodoItem = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addNewTodoItem(textareaContent, cardIndex)
        setTextareaContent('')
    }

    return (
        <form 
            onSubmit={submitAddTodoItem}
            className={s.card_footer}
        >
            <textarea 
                className={s.card_textarea} 
                placeholder="Ввести заголовок для этой карточки"
                onChange={(e) => setTextareaContent(e.target.value)}
                value={textareaContent}
            ></textarea>
            <button className={s.card_button}>
                Добавить
            </button>
        </form>
    )
}