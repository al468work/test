/*
 * data-source.js — единая точка доступа к данным админки.
 *
 * Сейчас источник — статические JSON из data/ (демо-режим).
 * Чтобы позже перейти на REST API master, достаточно заменить тела методов
 * на fetch(<URL>) с той же структурой ответа: остальные вьюхи не меняются.
 *
 * Форматы повторяют контракты прошивки master:
 *   data/rtc.json      -> { "Rtc":      {...} }
 *   data/week.json     -> { "Week":     { "1".."7": { "0".."23": {...} } } }
 *   data/channels.json -> { "Channels": { "1".."16": {...} } }
 *   data/ina.json      -> { "Ina": {...}, "InaHistory": { "hours": [...] } }
 */
(function (global) {
  'use strict';

  const DATA_DIR = 'data/';

  const DAY_NAMES_RU = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье'
  };

  // Палитра для 16 каналов (индекс 1..16).
  const CHANNEL_COLORS = [
    '#e6194b', '#3cb44b', '#4363d8', '#f58231',
    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c',
    '#fabebe', '#008080', '#e6beff', '#9a6324',
    '#800000', '#808000', '#000075', '#808080'
  ];

  async function loadJSON(path) {
    const response = await fetch(DATA_DIR + path, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Не удалось загрузить ${path}: HTTP ${response.status}`);
    }
    return response.json();
  }

  async function getRtc() {
    const doc = await loadJSON('rtc.json');
    return doc.Rtc;
  }

  async function getWeek() {
    const doc = await loadJSON('week.json');
    return doc.Week;
  }

  async function getChannels() {
    const doc = await loadJSON('channels.json');
    return doc.Channels;
  }

  async function getIna() {
    const doc = await loadJSON('ina.json');
    return { config: doc.Ina, history: doc.InaHistory };
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function formatTime(rtc) {
    if (!rtc) return '--:--:--';
    return `${pad2(rtc.hour)}:${pad2(rtc.minute)}:${pad2(rtc.second)}`;
  }

  function formatDate(rtc) {
    if (!rtc) return '--.--.----';
    return `${pad2(rtc.day)}.${pad2(rtc.month)}.${rtc.year}`;
  }

  function dayName(dayOfWeek) {
    return DAY_NAMES_RU[dayOfWeek] || `День ${dayOfWeek}`;
  }

  function channelColor(channel) {
    if (channel < 1 || channel > 16) return '#adb5bd';
    return CHANNEL_COLORS[channel - 1];
  }

  // Текущее задание по времени RTC и недельной сетке.
  // Активность: channel 1..16, enabled === true (как в Week master).
  function currentTask(rtc, week, channels) {
    if (!rtc || !week) return null;
    const day = week[String(rtc.dayOfTheWeek)];
    if (!day) return null;
    const cell = day[String(rtc.hour)];
    if (!cell || !cell.enabled) return null;

    const channel = cell.channel;
    if (!(channel >= 1 && channel <= 16)) return null;

    const ch = channels ? channels[String(channel)] : null;
    return {
      channel: channel,
      enabled: true,
      duration: cell.duration,
      name: ch ? ch.name : `Канал ${channel}`,
      mac: ch ? ch.mac : '',
      valve: ch ? ch.valve : 0,
      channelEnabled: ch ? !!ch.enabled : false
    };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  global.DataSource = {
    loadJSON,
    getRtc,
    getWeek,
    getChannels,
    getIna,
    formatTime,
    formatDate,
    dayName,
    channelColor,
    currentTask,
    escapeHtml,
    DAY_NAMES_RU,
    CHANNEL_COLORS
  };
})(window);
