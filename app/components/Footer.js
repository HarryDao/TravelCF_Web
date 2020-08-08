import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className='info'>
                <div className='address'>
                    <h5><i className='fa fa-phone'/> +65 9849 8495</h5>
                    <h5><i className='fa fa-envelope'/> 2 Holland Avenue, Singapore, 271002</h5>
                </div>

                <div className='menu'>

                </div>

                <div className='social'>
                    <a target='_blank' href='https://github.com/HarryDao'><i className='fa fa-github'/></a>
                    {/* <a><i className='fa fa-linkedin'/></a> */}
                </div>
            </div>

            <div className='copyright'>
                <i className='fa fa-copyright'/> Copyright Dao Nguyen Dang Khoa (Harry) 2018
            </div>
        </footer>
    );
}

export default Footer;