import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import style from './calendar.module.scss';

export const Calendar = () => {

	const [currentYear, setCurrentYear] = useState();
	const [currentMonth, setCurrentMonth] = useState();
	const [weekmonth, setWeekmonth] = useState([]);
	const [activeData, setActiveData] = useState({});

	useEffect(() => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth();

		setCurrentMonth(month);
		setCurrentYear(year);
	}, []);

	const months = [
		'Январь',
		'Феварль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	];

	const weekdays = [
		'пн',
		'вт',
		'ср',
		'чт',
		'пт',
		'сб',
		'вс'
	];

	const incrementMonth = () => {
		if (currentMonth !== 11) {
			return setCurrentMonth(currentMonth + 1);
		}

		setCurrentYear(currentYear + 1);
		setCurrentMonth(0);
	}

	const decrementMonth = () => {
		if (currentMonth !== 0) {
			return setCurrentMonth(currentMonth - 1);
		} 

		setCurrentYear(currentYear - 1);
		setCurrentMonth(11);
		
	}

	const getDays = (year, month) => {
		return new Date(year, month + 1, 0).getDate();
	}

	useEffect(() => {
		daysListComponent();
	}, [currentYear, currentMonth])

	const daysListComponent = async () => {
		const days = getDays(currentYear, currentMonth);
		console.log('days', days);
		let daysArray = [];

		const countDaysCurrentMonth = new Date(currentYear, currentMonth, 1).getDay();

		const fillDaysArrow = async (dayStart, dayEnd, month) => {
			for (let i = dayStart; i <= dayEnd; i++) {
				daysArray.push({
					day: i,
					month,
					year: currentYear
				});
			}
		}

		// загружаем предыдущий месяц
		if (countDaysCurrentMonth !== 0) {
			const countDaysPrevMonth = getDays(currentYear, currentMonth - 2);
			let start = countDaysPrevMonth - (countDaysCurrentMonth - 2);

			await fillDaysArrow(start, countDaysPrevMonth, currentMonth - 1)
		}

		// загружаем текущий месяц
		await fillDaysArrow(1, days, currentMonth);

		// загружаем следующий месяц
		if (daysArray.length !== 41) {
			let countDaysNextMonth = 42 - daysArray.length;
			fillDaysArrow(1, countDaysNextMonth, currentMonth + 1);
		}

		setWeekmonth(daysArray);
	}

	const handleData = (e) => {
		console.log('e', e);
		setActiveData(e);
	}

	return (
		<div className={style.calendar}>
			<div className={style.calendar__wrapper}>

				<div className={style.calendar__header}>
					<div className={style.info}>{months[currentMonth]} {currentYear}</div>
					<div className={[style['calendar__header-control'], style['calendar__control']].join(' ')}>
						<div className={style['calendar__control_left']} onClick={() => decrementMonth()}>left</div>
						<div className={style['calendar__control_right']} onClick={() => incrementMonth()}>right</div>
					</div>
				</div>

				<div className={style.calendar__weekdays}>
					{weekdays.map(w => (
						<div key={uuidv4()} className={style['calendar__weekdays-day']}>{w}</div>
					))}
				</div>
				
				<div className={style.calendar__days}>
					{weekmonth.length ? (
						weekmonth.map(el => (
							<div 
								key={uuidv4()} 
								className={[
									style['calendar__days-day'],
									el?.day === activeData?.day && 
									el?.year === activeData?.year &&
									el?.month === activeData?.month ? style['calendar__days-activeDay'] : '',
								].join(' ')} 
								onClick={() => handleData(el)}
							>
								{el?.day}
							</div>
						))
					) : ('')}
				</div>
			</div>
		</div>
	);
};