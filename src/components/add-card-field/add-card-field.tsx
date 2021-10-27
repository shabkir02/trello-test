import { useState, FormEvent } from 'react';

import s from './add-card-field.module.sass';

interface IAddCardField {
    addNewCardItem: (cardTitle: string) => void
}

export const AddCardField = ({ addNewCardItem }: IAddCardField) => {
    const [cardTitle, setCardTitle] = useState<string>('');

    const submitAddNewCardItem = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!cardTitle) {
            return
        }

        addNewCardItem(cardTitle)
        setCardTitle('')
    }

    return (
        <form 
                className={s.add_card_wrapper}
                onSubmit={submitAddNewCardItem}
            >
                <textarea 
                    className={s.add_card_textarea}
                    onChange={(e) => setCardTitle(e.target.value)} 
                    placeholder="Введите заголовок списка"
                    value={cardTitle}
                ></textarea>
                <button>
                    Добавить
                </button>
            </form>
    )
}