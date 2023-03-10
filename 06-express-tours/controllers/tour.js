const TourDAO = require('./../DAO/TourDAO')
const TourImageDAO = require('./../DAO/TourImageDAO')
const TourStartDateDAO = require('./../DAO/TourStartDateDAO')

exports.checkTourById = async (req, res, next, val) => {
    try{
        const id = val;
        const tour = await TourDAO.getTourById(id);
        if (!tour){
            return res
                .status(404)    //NOT FOUND
                .json({
                    code: 404,
                    msg: `Not found tour with Id ${id}!`,
                });
        }
        req.tour = tour;
    }catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({
                code: 500,
                msg: e
            })
    }
    next();
}


//CRUD OPERATIONS
exports.getAllTours = async (req, res) => {
    // console.log(req.requestTime);
    // const tours = await TourDAO.getAllTours();
    // res.status(200).json({
    //     code: 200,
    //     msg: `OK`,
    //     data: {
    //         tours
    //     }
    // })

    console.log(req.query);


    const {page,pageSize,totalPage,totalItem,tours} = await TourDAO.getAllTours(req.query);

    // console.log(tours);
    res.status(200).json({
        //200 - OK
        status: 'success',
        page,
        pageSize,
        totalPage,
        totalItem,
        data: {
            tours
        },
    });
}

exports.getTour = async (req, res) => {
    console.log(req.params);
    res.status(200).json({
        code: 200,
        msg: `OK`,
        data: {
            tour: req.tour
        }
    })
}

exports.createTour = async (req, res) => {
    const newTour = req.body;
    try {
        await TourDAO.createNewTour(newTour);
        let tour = await TourDAO.getTourByName(newTour.name);
        if (newTour.images && newTour.images.length > 0){
            for (let j = 0; j < newTour.images.length; j++) {
                await TourImageDAO.addTourImageIfNotExisted(tour.id, newTour.images[j]);
            }
        }
        if (newTour.startDates && newTour.startDates.length > 0){
            for (let j = 0; j < newTour.startDates.length; j++) {
                let date = new Date(newTour.startDates[j]);
                await TourStartDateDAO.addTourStartDateIfNotExisted(tour.id, date.toISOString());
            }
        }
        tour = await TourDAO.getTourById(tour.id);
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Create new tour successfully!`,
                data: {
                    tour
                }
            })
    }catch (e){
        console.log(e);
        res
            .status(500)
            .json({
                code: 500,
                msg: e
            });
    }
}

exports.deleteTour = async (req, res) => {
    const id = req.params.id*1;
    try {
        await TourImageDAO.deleteByTourId(id);
        await TourStartDateDAO.deleteByTourId(id);
        await TourDAO.deleteTourById(id);
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Delete tour with ${id} successfully!`,
            })
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({
                code: 500,
                msg: e
            })
    }
}

exports.updateTour = async (req, res) => {
    try {
        console.log('Id update', req.params.id);
        console.log(req.body);
        const id = req.params.id * 1;
        const updateInfo = req.body;
        await TourDAO.updateTourById(id , updateInfo);
        const tour = await TourDAO.getTourById(id);
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Update id: ${id} successfully!`,
                data: {
                    tour
                }
            })
    } catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({
                code: 500,
                msg: e
            })
    }

}