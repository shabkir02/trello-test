import { useEffect, useState } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from 'uuid';

import { TCardItem, TTodoItem } from '../../services/types';
import { AddCardField } from '../add-card-field/add-card-field';
import { TodoCard } from '../todo-card/todo-card';

import s from './app.module.sass';

export const App = () => {
	const [data, setData] = useState<Array<TCardItem>>([]);

	useEffect(() => {
		const cards = localStorage.getItem('data')
		if (cards) {
			setData(JSON.parse(cards))
		}
	}, [])

	useEffect(() => {
		if (data.length > 0) {
			localStorage.setItem('data', JSON.stringify(data))
		} else {
			localStorage.removeItem('data')
		}
	}, [data])

	const addNewTodoItem = (title: string, cardIndex: number) => {
		if (!title) {
			return
		}

		const newItem = {
			title,
			description: 'test',
			id: uuidv4(),
			creationDate: new Date().toISOString(),
			editDate: new Date().toISOString()
		}
		const newCard = {
			...data[cardIndex],
			content: [
				...data[cardIndex].content,
				newItem
			]
		}
		setData([...data.slice(0, cardIndex), newCard, ...data.slice(cardIndex + 1)]);
	}

	const deleteTodoItem = (todoItem: TTodoItem, cardIndex: number) => {
		const newTodoItemsArr = data[cardIndex].content.filter((item) => item.id !== todoItem.id);

		const newCard = {
			...data[cardIndex],
			content: newTodoItemsArr
		}
		setData([...data.slice(0, cardIndex), newCard, ...data.slice(cardIndex + 1)]);
	}

	const editTodoItem = (todoItem: TTodoItem, newTitle: string, cardIndex: number) => {
		const todoItemIndex = data[cardIndex].content.findIndex((item) => item.id === todoItem.id);

		const newTodoItem = {
			...data[cardIndex].content[todoItemIndex],
			title: newTitle,
			editDate: new Date().toISOString()
		}
		const newCard = {
			...data[cardIndex],
			content: [
				...data[cardIndex].content.slice(0, todoItemIndex), 
				newTodoItem, 
				...data[cardIndex].content.slice(todoItemIndex + 1)
			]
		}

		setData([...data.slice(0, cardIndex), newCard, ...data.slice(cardIndex + 1)]);
	}

	const addNewCardItem = (cardTitle: string) => {
		const cardItem = {
			id: uuidv4(),
			title: cardTitle,
			content: []
		}
		setData([...data, cardItem])
	}

	const deleteCardItem = (cardItem: TCardItem) => {
		const newDataArr = data.filter((item) => item.id !== cardItem.id);
		setData(newDataArr);
	}

	const moveTodoItemToAnotherBox = (dragCardIndex: number, dropCardIndex: number, todoItem: TTodoItem) => {
		const newCardDrag = {
			...data[dragCardIndex],
			content: [...data[dragCardIndex].content].filter((item) => item.id !== todoItem.id)
		}
		const newCardDrop = {
			...data[dropCardIndex],
			content: [...data[dropCardIndex].content, todoItem]
		}

		const newArr = data.map((card: TCardItem, index) => {
			if (dragCardIndex === index) {
				return newCardDrag
			}
			if (dropCardIndex === index) {
				return newCardDrop
			}

			return card
		})

		setData(newArr)
	}

	const moveTodoItemInCard = (dragIndex: number, hoverIndex: number, cardIndex: number) => {
		const arr = [...data[cardIndex].content];
		const dragItem = arr[dragIndex];
		const hoverItem = arr[hoverIndex];
		arr[hoverIndex] = dragItem;
		arr[dragIndex] = hoverItem;

		const newCard = {
			...data[cardIndex],
			content: arr
		}

		setData([...data.slice(0, cardIndex), newCard, ...data.slice(cardIndex + 1)]);
	}

  	return (
		<DndProvider backend={HTML5Backend}>
			<div className={s.app}>
				{data.map((card, cardIndex) => (
					<TodoCard 
						key={card.id}
						cardInfo={card}
						cardIndex={cardIndex}
						addNewTodoItem={addNewTodoItem}
						deleteTodoItem={deleteTodoItem}
						editTodoItem={editTodoItem}
						deleteCardItem={deleteCardItem}
						moveTodoItemInCard={moveTodoItemInCard}
						moveTodoItemToAnotherBox={moveTodoItemToAnotherBox}
					/>
				))}

				<AddCardField addNewCardItem={addNewCardItem} />
			</div>
		</DndProvider>
  	);
}
