"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const style_1 = require("@/app/styles/style");
const CoursePlayer_1 = __importDefault(require("@/app/utils/CoursePlayer"));
const coursesApi_1 = require("@/redux/features/courses/coursesApi");
const image_1 = __importDefault(require("next/image"));
const timeago_js_1 = require("timeago.js");
const react_1 = __importStar(require("react"));
const react_hot_toast_1 = require("react-hot-toast");
const ai_1 = require("react-icons/ai");
const bi_1 = require("react-icons/bi");
const vsc_1 = require("react-icons/vsc");
const Ratings_1 = __importDefault(require("@/app/utils/Ratings"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = (0, socket_io_client_1.default)(ENDPOINT, { transports: ["websocket"] });
const CourseContentMedia = ({ data, id, activeVideo, setActiveVideo, user, refetch, }) => {
    const [activeBar, setactiveBar] = (0, react_1.useState)(0);
    const [question, setQuestion] = (0, react_1.useState)("");
    const [review, setReview] = (0, react_1.useState)("");
    const [rating, setRating] = (0, react_1.useState)(1);
    const [answer, setAnswer] = (0, react_1.useState)("");
    const [questionId, setQuestionId] = (0, react_1.useState)("");
    const [reply, setReply] = (0, react_1.useState)("");
    const [reviewId, setReviewId] = (0, react_1.useState)("");
    const [isReviewReply, setIsReviewReply] = (0, react_1.useState)(false);
    const [addNewQuestion, { isSuccess, error, isLoading: questionCreationLoading },] = (0, coursesApi_1.useAddNewQuestionMutation)();
    const { data: courseData, refetch: courseRefetch } = (0, coursesApi_1.useGetCourseDetailsQuery)(id, { refetchOnMountOrArgChange: true });
    const [addAnswerInQuestion, { isSuccess: answerSuccess, error: answerError, isLoading: answerCreationLoading, },] = (0, coursesApi_1.useAddAnswerInQuestionMutation)();
    const course = courseData?.course;
    const [addReviewInCourse, { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewCreationLoading, },] = (0, coursesApi_1.useAddReviewInCourseMutation)();
    const [addReplyInReview, { isSuccess: replySuccess, error: replyError, isLoading: replyCreationLoading, },] = (0, coursesApi_1.useAddReplyInReviewMutation)();
    const isReviewExists = course?.reviews?.find((item) => item.user._id === user._id);
    const handleQuestion = () => {
        if (question.length === 0) {
            react_hot_toast_1.toast.error("Question can't be empty");
        }
        else {
            addNewQuestion({
                question,
                courseId: id,
                contentId: data[activeVideo]._id,
            });
        }
    };
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            setQuestion("");
            refetch();
            socketId.emit("notification", {
                title: `New Question Received`,
                message: `You have a new question in ${data[activeVideo].title}`,
                userId: user._id,
            });
        }
        if (answerSuccess) {
            setAnswer("");
            refetch();
            if (user.role !== "admin") {
                socketId.emit("notification", {
                    title: `New Reply Received`,
                    message: `You have a new question in ${data[activeVideo].title}`,
                    userId: user._id,
                });
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
        if (answerError) {
            if ("data" in answerError) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
        if (reviewSuccess) {
            setReview("");
            setRating(1);
            courseRefetch();
            socketId.emit("notification", {
                title: `New Question Received`,
                message: `You have a new question in ${data[activeVideo].title}`,
                userId: user._id,
            });
        }
        if (reviewError) {
            if ("data" in reviewError) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
        if (replySuccess) {
            setReply("");
            courseRefetch();
        }
        if (replyError) {
            if ("data" in replyError) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
    }, [
        isSuccess,
        error,
        answerSuccess,
        answerError,
        reviewSuccess,
        reviewError,
        replySuccess,
        replyError,
    ]);
    const handleAnswerSubmit = () => {
        addAnswerInQuestion({
            answer,
            courseId: id,
            contentId: data[activeVideo]._id,
            questionId: questionId,
        });
    };
    const handleReviewSubmit = async () => {
        if (review.length === 0) {
            react_hot_toast_1.toast.error("Review can't be empty");
        }
        else {
            addReviewInCourse({ review, rating, courseId: id });
        }
    };
    const handleReviewReplySubmit = () => {
        if (!replyCreationLoading) {
            if (reply === "") {
                react_hot_toast_1.toast.error("Reply can't be empty");
            }
            else {
                addReplyInReview({ comment: reply, courseId: id, reviewId });
            }
        }
    };
    return (<div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer_1.default title={data[activeVideo]?.title} videoUrl={data[activeVideo]?.videoUrl}/>
      <div className="w-full flex items-center justify-between my-3">
        <div className={`${style_1.styles.button} text-white  !w-[unset] !min-h-[40px] !py-[unset] ${activeVideo === 0 && "!cursor-no-drop opacity-[.8]"}`} onClick={() => setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)}>
          <ai_1.AiOutlineArrowLeft className="mr-2"/>
          Prev Lesson
        </div>
        <div className={`${style_1.styles.button} !w-[unset] text-white  !min-h-[40px] !py-[unset] ${data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"}`} onClick={() => setActiveVideo(data && data.length - 1 === activeVideo
            ? activeVideo
            : activeVideo + 1)}>
          Next Lesson
          <ai_1.AiOutlineArrowRight className="ml-2"/>
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600] dark:text-white text-black ">
        {data[activeVideo].title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (<h5 key={index} className={`800px:text-[20px] cursor-pointer ${activeBar === index
                ? "text-red-500"
                : "dark:text-white text-black"}`} onClick={() => setactiveBar(index)}>
            {text}
          </h5>))}
      </div>
      <br />
      {activeBar === 0 && (<p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
          {data[activeVideo]?.description}
        </p>)}

      {activeBar === 1 && (<div>
          {data[activeVideo]?.links.map((item, index) => (<div className="mb-5" key={index}>
              <h2 className="800px:text-[20px] 800px:inline-block dark:text-white text-black">
                {item.title && item.title + " :"}
              </h2>
              <a className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2" href={item.url}>
                {item.url}
              </a>
            </div>))}
        </div>)}

      {activeBar === 2 && (<>
          <div className="flex w-full">
            <image_1.default src={user.avatar
                ? user.avatar.url
                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"} width={50} height={50} alt="" className="w-[50px] h-[50px] rounded-full object-cover"/>
            <textarea name="" value={question} onChange={(e) => setQuestion(e.target.value)} id="" cols={40} rows={5} placeholder="Write your question..." className="outline-none bg-transparent ml-3 border dark:text-white text-black border-[#0000001d] dark:border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"></textarea>
          </div>
          <div className="w-full flex justify-end">
            <div className={`${style_1.styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${questionCreationLoading && "cursor-not-allowed"}`} onClick={questionCreationLoading ? () => { } : handleQuestion}>
              Submit
            </div>
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div>
            <CommentReply data={data} activeVideo={activeVideo} answer={answer} setAnswer={setAnswer} handleAnswerSubmit={handleAnswerSubmit} user={user} questionId={questionId} setQuestionId={setQuestionId} answerCreationLoading={answerCreationLoading}/>
          </div>
        </>)}

      {activeBar === 3 && (<div className="w-full">
          <>
            {!isReviewExists && (<>
                <div className="flex w-full">
                  <image_1.default src={user.avatar
                    ? user.avatar.url
                    : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"} width={50} height={50} alt="" className="w-[50px] h-[50px] rounded-full object-cover"/>
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black ">
                      Give a Rating <span className="text-red-500">*</span>
                    </h5>
                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i) => rating >= i ? (<ai_1.AiFillStar key={i} className="mr-1 cursor-pointer" color="rgb(246,186,0)" size={25} onClick={() => setRating(i)}/>) : (<ai_1.AiOutlineStar key={i} className="mr-1 cursor-pointer" color="rgb(246,186,0)" size={25} onClick={() => setRating(i)}/>))}
                    </div>
                    <textarea name="" value={review} onChange={(e) => setReview(e.target.value)} id="" cols={40} rows={5} placeholder="Write your comment..." className="outline-none bg-transparent 800px:ml-3 dark:text-white text-black border border-[#00000027] dark:border-[#ffffff57] w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins"></textarea>
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <div className={`${style_1.styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 800px:mr-0 mr-2 ${reviewCreationLoading && "cursor-no-drop"}`} onClick={reviewCreationLoading ? () => { } : handleReviewSubmit}>
                    Submit
                  </div>
                </div>
              </>)}
            <br />
            <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
            <div className="w-full">
              {(course?.reviews && [...course.reviews].reverse())?.map((item, index) => {
                return (<div className="w-full my-5 dark:text-white text-black" key={index}>
                      <div className="w-full flex">
                        <div>
                          <image_1.default src={item.user.avatar
                        ? item.user.avatar.url
                        : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"} width={50} height={50} alt="" className="w-[50px] h-[50px] rounded-full object-cover"/>
                        </div>
                        <div className="ml-2">
                          <h1 className="text-[18px]">{item?.user.name}</h1>
                          <Ratings_1.default rating={item.rating}/>
                          <p>{item.comment}</p>
                          <small className="text-[#0000009e] dark:text-[#ffffff83]">
                            {(0, timeago_js_1.format)(item.createdAt)} •
                          </small>
                        </div>
                      </div>
                      {user.role === "admin" && item.commentReplies.length === 0 && (<span className={`${style_1.styles.label} !ml-10 cursor-pointer`} onClick={() => {
                            setIsReviewReply(true);
                            setReviewId(item._id);
                        }}>
                          Add Reply
                        </span>)}

                      {isReviewReply && reviewId === item._id && (<div className="w-full flex relative">
                          <input type="text" placeholder="Enter your reply..." value={reply} onChange={(e) => setReply(e.target.value)} className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#000] dark:border-[#fff] p-[5px] w-[95%]"/>
                          <button type="submit" className="absolute right-0 bottom-1" onClick={handleReviewReplySubmit}>
                            Submit
                          </button>
                        </div>)}

                      {item.commentReplies.map((i, index) => (<div className="w-full flex 800px:ml-16 my-5" key={index}>
                          <div className="w-[50px] h-[50px]">
                            <image_1.default src={i.user.avatar
                            ? i.user.avatar.url
                            : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"} width={50} height={50} alt="" className="w-[50px] h-[50px] rounded-full object-cover"/>
                          </div>
                          <div className="pl-2">
                            <div className="flex items-center">
                              <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                              <vsc_1.VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]"/>
                            </div>
                            <p>{i.comment}</p>
                            <small className="text-[#ffffff83]">
                              {(0, timeago_js_1.format)(i.createdAt)} •
                            </small>
                          </div>
                        </div>))}
                    </div>);
            })}
            </div>
          </>
        </div>)}
    </div>);
};
const CommentReply = ({ data, activeVideo, answer, setAnswer, handleAnswerSubmit, questionId, setQuestionId, answerCreationLoading, }) => {
    return (<>
      <div className="w-full my-3">
        {data[activeVideo].questions.map((item, index) => (<CommentItem key={index} data={data} activeVideo={activeVideo} item={item} index={index} answer={answer} setAnswer={setAnswer} questionId={questionId} setQuestionId={setQuestionId} handleAnswerSubmit={handleAnswerSubmit} answerCreationLoading={answerCreationLoading}/>))}
      </div>
    </>);
};
const CommentItem = ({ questionId, setQuestionId, item, answer, setAnswer, handleAnswerSubmit, answerCreationLoading, }) => {
    const [replyActive, setreplyActive] = (0, react_1.useState)(false);
    return (<>
      <div className="my-4">
        <div className="flex mb-2">
          <div>
            <image_1.default src={item.user.avatar
            ? item.user.avatar.url
            : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"} width={50} height={50} alt="" className="w-[50px] h-[50px] rounded-full object-cover"/>
          </div>
          <div className="pl-3 dark:text-white text-black">
            <h5 className="text-[20px]">{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className="text-[#000000b8] dark:text-[#ffffff83]">
              {!item.createdAt ? "" : (0, timeago_js_1.format)(item?.createdAt)} •
            </small>
          </div>
        </div>
        <div className="w-full flex">
          <span className="800px:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2" onClick={() => {
            setreplyActive(!replyActive);
            setQuestionId(item._id);
        }}>
            {!replyActive
            ? item.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
            : "Hide Replies"}
          </span>
          <bi_1.BiMessage size={20} className="dark:text-[#ffffff83] cursor-pointer text-[#000000b8]"/>
          <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83]">
            {item.questionReplies.length}
          </span>
        </div>

        {replyActive && questionId === item._id && (<>
            {item.questionReplies.map((item) => (<div className="w-full flex 800px:ml-16 my-5 text-black dark:text-white" key={item._id}>
                <div>
                  <image_1.default src={item.user.avatar
                    ? item.user.avatar.url
                    : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"} width={50} height={50} alt="" className="w-[50px] h-[50px] rounded-full object-cover"/>
                </div>
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item.user.name}</h5>{" "}
                    {item.user.role === "admin" && (<vsc_1.VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]"/>)}
                  </div>
                  <p>{item.answer}</p>
                  <small className="text-[#ffffff83]">
                    {(0, timeago_js_1.format)(item.createdAt)} •
                  </small>
                </div>
              </div>))}
            <>
              <div className="w-full flex relative dark:text-white text-black">
                <input type="text" placeholder="Enter your answer..." value={answer} onChange={(e) => setAnswer(e.target.value)} className={`block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-[#fff] p-[5px] w-[95%] ${answer === "" ||
                (answerCreationLoading && "cursor-not-allowed")}`}/>
                <button type="submit" className="absolute right-0 bottom-1" onClick={handleAnswerSubmit} disabled={answer === "" || answerCreationLoading}>
                  Submit
                </button>
              </div>
              <br />
            </>
          </>)}
      </div>
    </>);
};
exports.default = CourseContentMedia;
