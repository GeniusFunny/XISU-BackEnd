const reptileUrl = 'http://jwxt.xisu.edu.cn/eams'
const fetchScore = '/teach/grade/course/person!historyCourseGrade.action'
const classroom = '/classroom/apply/free!search.action'
const courseTable = '/courseTableForStd!courseTable.action'
const courseTask = '/courseTableForStd!taskTable.action'
const courseTableId = '/courseTableForStd.action'
const fetchInfo = '/stdDetail.action'
const login = '/login.action'

exports.fetchScore = reptileUrl + fetchScore
exports.fetchClassroom = reptileUrl + classroom
exports.login = reptileUrl + login
exports.fetchLoginInfo = reptileUrl + login
exports.fetchCourseTable = reptileUrl + courseTable
exports.fetchCourseTask = reptileUrl + courseTask
exports.fetchCourseTableId = reptileUrl + courseTableId
exports.fetchInfo = reptileUrl + fetchInfo
