import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

import style from './calendar.module.scss';

export const Calendar = ({rangeMode}) => {

	const [currentYear, setCurrentYear] = useState();
	const [currentMonth, setCurrentMonth] = useState();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [weekmonth, setWeekmonth] = useState([]);
	const [activeData, setActiveData] = useState({});
	const [range, setRange] = useState({
		startDay: null,
		endDay: null,
	});

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

	const getNewDate = (year, month, day) => {
		return new Date(year, month, day);
	}

	useEffect(() => {
		daysListComponent();
	}, [currentYear, currentMonth])

	/**
		 * 
		 * @param {Number} dayStart 
		 * @param {Number} dayEnd 
		 * @param {Number} month 
		 * @param {Array} filledArray
		 */
	 const fillDaysArrow = async (dayStart, dayEnd, month, filledArray) => {
		for (let i = dayStart; i <= dayEnd; i++) {
			filledArray.push({
				day: i,
				month,
				year: currentYear,
				dayOfWeek: new Date(currentYear, month, i).getDay(),
				disabled: month !== currentMonth ? 'true' : 'false',
				info: new Date(currentYear, month, i)
			});
		}
	}

	const daysListComponent = async () => {
		const days = getDays(currentYear, currentMonth);
		let daysArray = [];

		const countDaysCurrentMonth = new Date(currentYear, currentMonth, 1).getDay();

		// загружаем предыдущий месяц
		if (countDaysCurrentMonth !== 0) {
			const countDaysPrevMonth = getDays(currentYear, currentMonth - 2);
			let start = countDaysPrevMonth - (countDaysCurrentMonth - 2);

			await fillDaysArrow(start, countDaysPrevMonth, currentMonth - 1, daysArray)
		}

		// загружаем текущий месяц
		await fillDaysArrow(1, days, currentMonth, daysArray);

		// загружаем следующий месяц
		if (daysArray.length !== 41) {
			let countDaysNextMonth = 42 - daysArray.length;
			fillDaysArrow(1, countDaysNextMonth, currentMonth + 1, daysArray);
		}

		setWeekmonth(daysArray);
	}

	const handleRange = (e) => {
		const {info} = e;

		if (range.endDay !== null) {
			setActiveData({});

			return setRange({
				startDay: null,
				endDay: null,
			})
		}

		if (range.startDay === null) {
			
			setRange({
				...range,
				startDay: info
			})
		} else {
			setRange({
				...range,
				endDay:  info
			})
		}

		setActiveData(e);
	}

	const handleData = async (e) => {

		if (currentYear !== e.year || currentMonth !== e.month) {
			return false;
		}
		
		if (rangeMode) {
			handleRange(e);
		} else {
			setActiveData(e);
		}
		
	}

	return (
		<div className={style.calendar}>
			<div className={style.calendar__wrapper}>

				<div className={style.calendar__header}>
					<div className={style.info}>{months[currentMonth]} {currentYear}</div>
					<div className={[style['calendar__header-control'], style['calendar__control']].join(' ')}>
						<div className={style['calendar__control_left']} onClick={() => decrementMonth()}>
							<GrFormPrevious size={20} />
						</div>
						<div className={style['calendar__control_right']} onClick={() => incrementMonth()}>
							<GrFormNext size={20} />
						</div>
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
									el?.month !== currentMonth ? style['calendar__days-disabled'] : '',
									el?.dayOfWeek === (0) || el?.dayOfWeek === (6) ? style['calendar__days-red'] : '',
									rangeMode && el?.info > range?.startDay && el?.info < range?.endDay ? style['calendar__days-ranged'] : '',
									rangeMode && el?.info === range?.startDay ? style['calendar__days-activeDay'] : '',
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