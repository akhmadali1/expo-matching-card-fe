import React from 'react'
import { truncateString } from '@/lib/truncate-string';
import { Button, Card, Form, Input, Radio } from 'antd';

export default function StageOne(props) {
    const { dataScoreBoard, username, difficulty, audioRef, setUsername, setDifficulty, setClickPlay } = props;

    let dataScoreBoardChild = dataScoreBoard;
    if (!dataScoreBoard || dataScoreBoard.length < 3) {
        dataScoreBoardChild = [];
    }

    const playAudio = () => {
        const audio = audioRef.current;

        // Check if the audio is paused or hasn't started
        if (audio.paused || audio.ended) {
            audio.play().catch(error => {
                // Autoplay was prevented; handle it here
                console.error('Autoplay prevented:', error);
            });
        }
    };
    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setDifficulty(e.target.value);
    };
    return (
        <>
            <h1>Top 3</h1>
            <div className="podium-container">
                <div className="podium">
                    <div className="podium__front podium__left">
                        <div className="">2</div>
                        <div className="podium__image"><p style={{ fontSize: '30px' }}>{truncateString(dataScoreBoardChild[1]?.Username, 5, "...")}</p></div>
                    </div>
                    <div className="podium__front podium__center">
                        <div className="">1</div>
                        <div className="podium__image"><p style={{ fontSize: '30px' }}>{truncateString(dataScoreBoardChild[0]?.Username, 5, "...")}</p></div>
                    </div>
                    <div className="podium__front podium__right">
                        <div className="">3</div>
                        <div className="podium__image"><p style={{ fontSize: '30px' }}>{truncateString(dataScoreBoardChild[2]?.Username, 5, "...")}</p></div>
                    </div>
                </div>
            </div>
            <Card style={{ width: '100%' }}>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        // maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={(e) => {
                        if (e.username !== "") {
                            playAudio();
                            setClickPlay(1);
                        }
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input placeholder='Username' value={username} onChange={(e) => {
                            setUsername(e.target.value);
                        }} />
                    </Form.Item>

                    <Form.Item
                        label=""
                        name="difficulty"
                        rules={[
                            {
                                required: true,
                                message: 'Please choose difficulty!',
                            },
                        ]}
                    >
                        <Radio.Group onChange={onChange} value={difficulty}>
                            <Radio value={2}>Basic</Radio>
                            <Radio value={3}>Advance</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}
