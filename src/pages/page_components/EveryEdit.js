import React from 'react';
import dayjs from 'dayjs';
import { useFetch } from 'use-http';
import { DatePicker } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import useToggle from '@/hooks/useToggle';
import { toast } from '@/components/toastify';

export default React.memo(({ line = '{}', day }) => {
  const json = React.useMemo(() => {
    let result = {};
    try {
      result = JSON.parse(line);
    } catch (e) {
      console.log('json parse error');
    }
    console.log('json parse = ', result);
    result.phraseYin = result.phrase?.map((obj) => obj.en);
    result.phraseHan = result.phrase?.map((obj) => obj.ch);
    result.examplesYin = result.examples?.map((obj) => obj.en);
    result.examplesHan = result.examples?.map((obj) => obj.ch);
    return result;
  }, []);
  const { post, loading } = useFetch('/pub/user');
  console.log('loading', loading);
  const [word, setWord] = React.useState(json.word || '单词');
  const [englishWords, setEnglishWords] = React.useState(json.englishWords ? json.englishWords.join(' ') : '英');
  const [chinese, setChinese] = React.useState(json.chinese || '/音标/');
  const [soundmark, setSoundmark] = React.useState(json.soundmark || '');
  const [wordDesc, setWordDesc] = React.useState(json.wordDesc || ['adv. 释义一', 'det. 释义二']);
  const [phraseYin, setPhraseYin] = React.useState(json.phraseYin || ['短语英']);
  const [phraseHan, setPhraseHan] = React.useState(json.phraseHan || ['短语汉']);
  const phrase = (phraseYin || []).map((yin, index) => {
    if (phraseHan?.length <= index) return null;
    return { en: yin, ch: phraseHan[index] };
  }).filter((item) => item != null);
  const [examplesYin, setExamplesYin] = React.useState(json.examplesYin || ['例句英']);
  const [examplesHan, setExamplesHan] = React.useState(json.examplesHan || ['例句汉']);
  const examples = (examplesYin || []).map((yin, index) => {
    if (examplesHan?.length <= index) return null;
    return { en: yin, ch: examplesHan[index] };
  }).filter((item) => item != null);

  const [more, setMore] = React.useState(json.more || ['辨析一', '辨析一']);
  const [publishDay, setPublishDay] = React.useState(day ? dayjs(day).format('YYYY/MM/DD') : dayjs().add(1, 'day').format('YYYY/MM/DD'));

  const initData = {
    word,
    englishWords: englishWords?.split?.(' ') || [],
    chinese: chinese || '',
    soundmark: soundmark || '',
    wordDesc: wordDesc || [],
    phrase: phrase || [],
    examples: examples || [],
    more: more || [],
  };

  const toggle = useToggle();
  return (
    <div className="edit-home-wrap space-y-5 w-fit">
      <div className="flex space-x-8">
        <div className="flex items-center space-x-8">
          <div className="w-24">
            今日句子
          </div>
          <input
            type="text"
            className="w-full px-2 py-1 border border-solid w-56"
            value={englishWords}
            onChange={(e) => setEnglishWords(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-8">
          <div className="w-24">
            句子翻译
          </div>
          <input
            type="text"
            className="w-full px-2 py-1 border border-solid w-56"
            value={chinese}
            onChange={(e) => setChinese(e.target.value)}
          />
        </div>
      </div>
      <div className="flex space-x-8">
        <div className="flex items-center space-x-8">
          <div className="w-24">
            所学单词
          </div>
          <input
            type="text"
            className="w-full px-2 py-1 border border-solid w-56"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-8">
          <div className="w-24">
            单词音标
          </div>
          <input
            type="text"
            className="w-full px-2 py-1 border border-solid w-56"
            value={soundmark}
            onChange={(e) => setSoundmark(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <div className="w-24">
          单词释义
        </div>
        <textarea
          rows={wordDesc.length}
          className="w-full px-2 py-1 border border-solid bg-transparent"
          value={wordDesc.join('\n')}
          onChange={(e) => setWordDesc(e.target.value?.split('\n'))}
        />
      </div>
      <div className="flex items-center space-x-5">
        <div className="w-24">
          单词短语
        </div>
        <textarea
          rows={phraseYin.length}
          className="w-full px-2 py-1 border border-solid bg-transparent"
          value={phraseYin.join('\n')}
          onChange={(e) => setPhraseYin(e.target.value?.split('\n'))}
        />
      </div>
      <div className="flex items-center space-x-5">
        <div className="w-24">
          短语释义
        </div>
        <textarea
          rows={phraseHan.length}
          className="px-2 py-1 border border-solid w-full bg-transparent"
          value={phraseHan.join('\n')}
          onChange={(e) => setPhraseHan(e.target.value?.split('\n'))}
        />
      </div>
      <div className="flex items-center space-x-5">
        <div className="w-24">
          单词例句
        </div>
        <textarea
          rows={examplesYin.length}
          value={examplesYin.join('\n')}
          className="px-2 py-1 border border-solid w-full bg-transparent"
          onChange={(e) => setExamplesYin(e.target.value?.split('\n'))}
        />
      </div>
      <div className="flex items-center space-x-5">
        <div className="w-24">
          例句释义
        </div>
        <textarea
          rows={examplesHan.length}
          value={examplesHan.join('\n')}
          className="px-2 py-1 border border-solid w-full bg-transparent"
          onChange={(e) => setExamplesHan(e.target.value?.split('\n'))}
        />
      </div>
      <div className="flex items-center space-x-5">
        <div className="w-24">
          更多介绍
        </div>
        <textarea
          type="text"
          className="px-2 py-1 border border-solid w-full bg-transparent"
          rows={more.length}
          value={more.join('\n')}
          onChange={(e) => setMore(e.target.value?.split('\n'))}
        />
      </div>
      <div className="relative flex items-center space-x-5">
        <div className="w-24">
          发布日期
        </div>
        <div className="px-2 py-1 border border-solid w-full bg-transparent" onClick={() => toggle.toggle('every/date')}>{publishDay}</div>
        {toggle.toggled('every/date') && (
          <DatePicker
            className="dropdown"
            onChange={(jsDate) => setPublishDay(dayjs(jsDate).format('YYYY/MM/DD'))}
            value={publishDay}
          />
        )}
      </div>
      <div className="button-wrap cursor-pointer">
        <div
          className="publish"
          onClick={() => {
            if (publishDay?.length !== 10) {
              toast.error('发布日期不正确');
              return;
            }
            if (typeof initData !== 'object') {
              toast.error('数据格式错误');
              return;
            }
            post('/addDayAWord', {
              data: {
                day: publishDay?.replaceAll('/', ''),
                en: englishWords,
                ch: chinese,
                contentJson: JSON.stringify(initData),
              },
            }).then((data) => {
              const { returnCode, returnMessage } = data || {};
              if (returnCode !== '0000') {
                toast.error(returnMessage);
                return;
              }
              toast.success('发布成功');
              window.history.back();
            }).catch((err) => {
              toast.error(err);
            });
          }}
        >
          发布
        </div>
      </div>
    </div>);
});
